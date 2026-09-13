import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from pathlib import Path

import app


class ScoringTests(unittest.TestCase):
    def test_all_fives_is_leading(self):
        result = app.score_assessment({a: 5 for a in app.AREAS})
        self.assertEqual(result["score"], 100)
        self.assertEqual(result["level"], "Leading")

    def test_low_score_recommends_audit(self):
        result = app.score_assessment({a: 1 for a in app.AREAS})
        self.assertEqual(result["score"], 0)
        self.assertEqual(result["recommendation"], "audit")

    def test_weakest_area_drives_recommendation(self):
        answers = {a: 5 for a in app.AREAS} | {"readiness": 2}
        result = app.score_assessment(answers)
        self.assertEqual(result["focus"], ["readiness"])
        self.assertEqual(result["recommendation"], "leadership")

    def test_rejects_out_of_range(self):
        with self.assertRaises(app.ValidationError):
            app.score_assessment({a: 6 for a in app.AREAS})


class ContactValidationTests(unittest.TestCase):
    def test_valid_payload(self):
        clean = app.validate_contact({"type": "diagnostic", "name": "Zineb", "email": "z@example.com", "company": "Acme"})
        self.assertEqual(clean["name"], "Zineb")

    def test_reports_each_bad_field(self):
        with self.assertRaises(app.ValidationError) as ctx:
            app.validate_contact({"type": "nope", "email": "bad"})
        self.assertEqual(set(ctx.exception.fields), {"type", "name", "email", "company"})


class HttpTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        app.DATA_DIR = Path(cls.tmp.name)
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), app.Handler)
        cls.base = f"http://127.0.0.1:{cls.server.server_address[1]}"
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.tmp.cleanup()

    def post(self, path, body):
        req = urllib.request.Request(self.base + path, json.dumps(body).encode(), {"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req) as res:
                return res.status, json.load(res)
        except urllib.error.HTTPError as err:
            return err.code, json.load(err)

    def test_contact_is_stored(self):
        status, body = self.post("/api/contact", {"type": "proposal", "name": "Zineb", "email": "z@example.com", "company": "Acme"})
        self.assertEqual(status, 201)
        self.assertTrue(body["ok"])
        lines = (app.DATA_DIR / "contact_requests.jsonl").read_text().splitlines()
        self.assertEqual(json.loads(lines[-1])["id"], body["id"])

    def test_contact_validation_error(self):
        status, body = self.post("/api/contact", {"type": "proposal"})
        self.assertEqual(status, 422)
        self.assertIn("email", body["fields"])

    def test_assessment_endpoint(self):
        status, body = self.post("/api/assessment", {"answers": {a: 3 for a in app.AREAS}})
        self.assertEqual(status, 200)
        self.assertEqual(body["result"]["score"], 50)

    def test_unknown_route(self):
        status, _ = self.post("/api/nope", {})
        self.assertEqual(status, 404)


if __name__ == "__main__":
    unittest.main()
