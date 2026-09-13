"""Smarktic website backend — Python standard library only.

Routes
  GET  /api/health       liveness check
  POST /api/contact      booking / proposal / contact requests
  POST /api/assessment   scores the Digital Maturity Self-Check
  POST /api/case-study   ROI case-study requests
Anything else is served from ../dist (the Vite build) with SPA fallback.

Submissions are appended as JSON lines to server/data/.

Run:  python3 server/app.py [--port 8000]
"""

import argparse
import json
import re
import uuid
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Lock

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
DIST_DIR = ROOT.parent / "dist"
MAX_BODY = 64 * 1024

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
REQUEST_TYPES = {"diagnostic", "proposal", "performance", "contact"}
AREAS = ["maturity", "governance", "alignment", "readiness", "risk"]
AREA_TO_SERVICE = {
    "governance": "audit",
    "risk": "audit",
    "maturity": "audit",
    "alignment": "roadmap",
    "readiness": "leadership",
}

_write_lock = Lock()


class ValidationError(Exception):
    def __init__(self, fields):
        super().__init__("Please check the highlighted fields.")
        self.fields = fields


def _text(payload, key, limit):
    value = payload.get(key, "")
    return value.strip()[:limit] if isinstance(value, str) else ""


def validate_contact(payload):
    fields = {}
    clean = {
        "type": _text(payload, "type", 20),
        "name": _text(payload, "name", 120),
        "email": _text(payload, "email", 200),
        "company": _text(payload, "company", 200),
        "role": _text(payload, "role", 120),
        "message": _text(payload, "message", 5000),
    }
    priorities = payload.get("priorities", [])
    clean["priorities"] = [p[:80] for p in priorities if isinstance(p, str)][:10] if isinstance(priorities, list) else []

    if clean["type"] not in REQUEST_TYPES:
        fields["type"] = "Unknown request type."
    if len(clean["name"]) < 2:
        fields["name"] = "Please enter your name."
    if not EMAIL_RE.match(clean["email"]):
        fields["email"] = "Please enter a valid email."
    if not clean["company"]:
        fields["company"] = "Please enter your organization."
    if fields:
        raise ValidationError(fields)
    return clean


def score_assessment(answers):
    """Mirrors scoreLocally() in src/lib/assessment.js."""
    if not isinstance(answers, dict):
        raise ValidationError({"answers": "Answers are required."})
    values = []
    for area in AREAS:
        value = answers.get(area)
        if not isinstance(value, int) or isinstance(value, bool) or not 1 <= value <= 5:
            raise ValidationError({area: "Each answer must be between 1 and 5."})
        values.append(value)

    avg = sum(values) / len(values)
    score = round((avg - 1) / 4 * 100)
    if score < 25:
        level = "Exploratory"
    elif score < 50:
        level = "Emerging"
    elif score < 75:
        level = "Structured"
    else:
        level = "Leading"
    lowest = min(values)
    focus = [area for area, v in zip(AREAS, values) if v == lowest]
    recommendation = "audit" if score < 50 else AREA_TO_SERVICE[focus[0]]
    return {"score": score, "level": level, "focus": focus, "recommendation": recommendation}


def store(filename, record):
    DATA_DIR.mkdir(exist_ok=True)
    record = {"id": uuid.uuid4().hex, "received_at": datetime.now(timezone.utc).isoformat(), **record}
    with _write_lock, open(DATA_DIR / filename, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
    return record["id"]


class Handler(SimpleHTTPRequestHandler):
    server_version = "Smarktic/1.0"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST_DIR), **kwargs)

    # --- helpers -----------------------------------------------------------
    def _json(self, status, body):
        data = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def _read_json(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length > MAX_BODY:
            raise ValueError("Request too large.")
        try:
            payload = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError as exc:
            raise ValueError("Invalid JSON.") from exc
        if not isinstance(payload, dict):
            raise ValueError("Expected a JSON object.")
        return payload

    # --- routes ------------------------------------------------------------
    def do_GET(self):
        if self.path.startswith("/api/"):
            if self.path.rstrip("/") == "/api/health":
                return self._json(HTTPStatus.OK, {"ok": True})
            return self._json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "Not found."})
        if not DIST_DIR.exists():
            return self._json(
                HTTPStatus.SERVICE_UNAVAILABLE,
                {"ok": False, "error": "Frontend not built. Run `npm run build` or use `npm run dev`."},
            )
        # SPA fallback: unknown paths get index.html (routing is hash-based).
        target = DIST_DIR / self.path.split("?")[0].lstrip("/")
        if not target.resolve().is_relative_to(DIST_DIR) or not target.exists():
            self.path = "/index.html"
        return super().do_GET()

    def do_POST(self):
        routes = {
            "/api/contact": self._contact,
            "/api/assessment": self._assessment,
            "/api/case-study": self._case_study,
        }
        route = routes.get(self.path.rstrip("/"))
        if not route:
            return self._json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "Not found."})
        try:
            return route(self._read_json())
        except ValidationError as exc:
            return self._json(HTTPStatus.UNPROCESSABLE_ENTITY, {"ok": False, "error": str(exc), "fields": exc.fields})
        except ValueError as exc:
            return self._json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(exc)})

    def _contact(self, payload):
        record = validate_contact(payload)
        request_id = store("contact_requests.jsonl", record)
        self.log_message("New %s request from %s", record["type"], record["company"])
        return self._json(HTTPStatus.CREATED, {"ok": True, "id": request_id})

    def _assessment(self, payload):
        result = score_assessment(payload.get("answers"))
        store("assessments.jsonl", {"answers": payload["answers"], "result": result})
        return self._json(HTTPStatus.OK, {"ok": True, "result": result})

    def _case_study(self, payload):
        email = _text(payload, "email", 200)
        if not EMAIL_RE.match(email):
            raise ValidationError({"email": "Adresse email invalide."})
        request_id = store("case_study_requests.jsonl", {"email": email, "company": _text(payload, "company", 200)})
        return self._json(HTTPStatus.CREATED, {"ok": True, "id": request_id})


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"Smarktic backend running on http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
