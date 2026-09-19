# Smarktic website

Interactive website for Smarktic, built from *Smarktic New Web site content.pdf*.

- **Frontend:** React 19 + Vite, animated with `motion`, `ogl` (WebGL), and `lenis` (smooth scroll)
- **Backend:** Python 3 standard library only (`server/app.py`), no `pip install` needed

## Pages

| Route | Content |
| --- | --- |
| `#/` | Home: hero, the problem, how we help, who we work with, approach, credibility |
| `#/services` | The three engagements, a horizontal-scroll journey, and the Digital Maturity Self-Check |
| `#/growth` | Croissance Digitale (FR): pillars, ROI simulator, deliverables, FAQ, case-study request |
| `#/contact` | 3-step booking / proposal form (`?type=diagnostic\|proposal\|performance\|contact`) |

## Interactive components (`src/components/bits`)

Written from scratch in the React Bits style:

| Component | Effect |
| --- | --- |
| `Aurora` | WebGL aurora background that follows the mouse |
| `SplitText` | Letter-by-letter blur reveal with gradient highlights |
| `DecryptedText` | Scrambled text that resolves on view and on hover |
| `ScrollRevealText` | Each word lights up as you scroll |
| `SpotlightCard` | Card with a light that follows the pointer |
| `TiltCard` | 3D tilt toward the pointer |
| `Magnet` | Buttons that pull toward the cursor |
| `ClickSpark` | Burst of sparks on every click |
| `DotGrid` | Interactive dot field with click shockwaves |
| `CountUp`, `AnimatedNumber` | Animated numbers |
| `Marquee` | Infinite scrolling ticker |

Feature components:

- `GapCheck`: checklist that fills a risk meter
- `HelpVenn`: interactive Venn diagram
- `PersonaPicker`: persona cards
- `MaturityQuiz`: live radar chart; scored by Python
- `RoiCalculator`: CAC / LTV / ROAS simulator
- `Accordion`: FAQ
- `CaseStudyModal`: case-study request form

## Run in development

Start both processes in two terminals:

```bash
python3 server/app.py
```

```bash
npm run dev
```

Open http://localhost:5173. Vite proxies `/api/*` to the Python server on port 8000.

## Run in production

```bash
npm run build && python3 server/app.py --host 0.0.0.0 --port 8000
```

The Python server serves the built `dist/` folder and the API together.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Liveness check |
| POST | `/api/contact` | Validates a request and appends it to `server/data/contact_requests.jsonl` |
| POST | `/api/assessment` | Scores the self-check (score, level, focus areas, recommended engagement) |
| POST | `/api/case-study` | Stores an ROI case-study request |

Submissions are stored locally as JSON lines. Nothing sends email yet; hook up an email or CRM service in `store()` when you're ready.

## Tests

```bash
cd server && python3 -m unittest -v
```

## Notes

- The ROI simulator is labeled as an illustrative simulation. Its numbers come from the visitor's own inputs.
- The "download case study" link collects an email because the PDF did not include a case-study file. Replace this with a real download once one exists.
- Animations respect `prefers-reduced-motion`.
