# State Fund (CA) Playwright (TypeScript) Interview Demo

A TypeScript-based Playwright automation framework used to validate key public-site quality signals on **https://www.statefundca.com**.

This repo is intentionally designed for interview demos to highlight Playwright strengths:
- resilient locators + web-first assertions
- link integrity (including PDFs)
- network health detection (failed requests / 4xx/5xx)
- rich artifacts (HTML report, trace, video, screenshots)

Bonus (optional for interviews):
- **Cucumber (BDD) skeleton** using Playwright (see `npm run bdd`)

Optional talking points (not implemented here to keep the demo lean):
- Python 3.11 utilities for **evaluation/validation pipelines** (e.g., link-check diffs, trend charts, artifact triage)
- **LLM-assisted** test generation/refinement (guardrailed prompts + approvals)

---

## 1. Prerequisites

| Tool | Recommended Version | Notes |
|------|----------------------|-------|
| Node.js | 20.x (LTS) | Use `nvm use 20` inside the project root |
| npm | 9 or higher | Installed with Node |
| Git | Latest | Required for cloning and version control |
| macOS / Linux / Windows | Any supported OS | Verified on all three platforms |

---

## 2. Clone and Install

```bash
git clone https://github.com/<your-org-or-username>/statefund-playwright-ts.git
cd statefund-playwright-ts

# install dependencies
npm install

# install browser binaries (Chromium, Firefox — WebKit optional)
npx playwright install
# npx playwright install webkit   # only if using the WebKit project
```

---

## 3. Project Structure

```
statefund-playwright-ts/
├── src/
│   └── pages/
│       └── StateFundHomePage.ts        # lightweight page object (landmark-based)
├── tests/
│   ├── ui/
│   │   ├── headerFooter.spec.ts        # header/footer smoke
│   │   ├── navigation.spec.ts          # clicks a few internal header links
│   │   └── trace-demo.spec.ts          # intentional failure (TRACE_DEMO=1)
│   ├── integrity/
│   │   └── links.spec.ts               # header/footer link + PDF integrity
│   ├── network/
│   │   └── health.spec.ts              # requestfailed + 4xx/5xx detection
│   └── api/
│       └── site-health.api.spec.ts     # simple HTTP health baseline
├── utils/
│   ├── linkChecker.ts                  # HTTP link validator
│   ├── networkMonitor.ts               # request/response monitor
│   └── printResolvedConfig.ts
├── playwright.config.ts
├── bdd/
│   ├── features/                      # Cucumber feature files
│   ├── steps/                         # Step definitions (TypeScript)
│   └── support/                       # World + hooks (Playwright lifecycle)
├── cucumber.js                        # CucumberJS config
├── package.json
└── README.md
```

---

## 4. Environment Flags

These runtime flags allow you to change behavior without modifying config files.

| Env Var | Values | Effect |
|---------|--------|--------|
| HEADLESS | true/false | Controls visibility of the browser window (default true) |
| SCREENSHOT | true/false | Page Object attaches screenshots on key actions |
| STEP_SHOTS_EVERY | integer | Throttle screenshot frequency during long loops |
| TRACE | true/false | Enables Playwright trace recording |
| VIDEO | true/false | Enables video recording |
| BASE_URL | URL | Overrides default https://www.statefundca.com |

Examples:
```bash
HEADLESS=false SCREENSHOT=true npx playwright test --project=chromium
TRACE=true VIDEO=true npm test
TRACE_DEMO=1 TRACE=true VIDEO=true SCREENSHOT=true npx playwright test tests/ui/trace-demo.spec.ts
```

---

## 5. Running Tests by Browser

### 5.1 Full Suite (headed or headless)

```bash
# headed
HEADLESS=false npm run test:headed

# headless
npm test
```

### 5.2 Chrome Only

```bash
# headed
HEADLESS=false npx playwright test --project=chromium

# headless
npx playwright test --project=chromium
```

### 5.3 Firefox Only

```bash
# headed
HEADLESS=false npx playwright test --project=firefox

# headless
npx playwright test --project=firefox
```

## 6. Debugging and Development

### Playwright Inspector

```bash
HEADLESS=false npm run debug
```

### Run a Single Spec

```bash
npx playwright test tests/ui/headerFooter.spec.ts --project=chromium
```

---

## 7. Cucumber (BDD)

Run the sample feature:

```bash
npm run bdd
```

Notes:
- This is a **minimal skeleton** intended to demonstrate BDD wiring in TypeScript.
- Playwright Test remains the primary runner for the full suite.

### Filter Tests by Title

```bash
npx playwright test -g "Footer"
```

---

## 8. Reporting and Artifacts

### HTML Report

After any run:

```bash
npx playwright show-report
```

### Trace Viewer

```bash
TRACE=true npm test
npx playwright show-trace test-results/**/trace.zip
```

### Videos

```bash
VIDEO=true npm test
```

---

## 9. View Resolved Configuration

```bash
npm run pw:print
```

Example output:
```
=== RESOLVED PLAYWRIGHT CONFIG ===
testDir: ./tests
retries: 0
timeout: 90000
workers: 4
projects: chromium, firefox
[chromium] use = { ... }
[firefox]  use = { ... }
```

---

## 10. Cleanup

```bash
rm -rf node_modules .cache test-results target playwright-report
```

---

## 11. Common Issues

| Issue | Resolution |
|-------|------------|
| Project "webkit" not found | Add WebKit to config + run `npx playwright install webkit` |
| Browser does not appear | Set `HEADLESS=false` |
| Duplicate logs | Multiple projects running in parallel; use `--project=chromium` |
| Missing screenshots | Run with `SCREENSHOT=true` |
| No trace or video | Add `TRACE=true` and/or `VIDEO=true` |

---

## 12. Test Flow Summary

A typical State Fund homepage verification test performs:

1. Navigate to https://www.statefundca.com
2. Validate accessibility baseline ("Skip to content" link)
3. Validate header, logo, login link, and key top-nav links
4. Scroll and validate footer sections
5. Optionally validate link integrity + network health
6. Capture optional screenshots and artifacts

---

## 13. Quick Start

```bash
git clone https://github.com/<your-org-or-username>/statefund-playwright-ts.git
cd statefund-playwright-ts

npm install
npx playwright install

HEADLESS=false SCREENSHOT=true npx playwright test --project=chromium
npx playwright show-report
```

---

## 14. Contributing and Git Hygiene

### Branching Strategy

- main → stable branch  
- feature/* → new enhancements  
- fix/* → bug fixes  
- chore/* → config updates, dependency bumps  

### Commit Conventions (Conventional Commits)

```
feat: add State Fund footer validation  
fix: correct selector for promo banner  
chore: update README for Docker usage  
```

### Pull Request Guidelines

1. Keep PRs focused and concise  
2. Include screenshots, logs, or report links  
3. Reference issues (for example, Closes #15)  
4. Run full test suite before pushing  

### Example Workflow

```bash
git checkout -b feature/add-statefund-header-tests
# make updates
git add .
git commit -m "feat: implement header verification for State Fund homepage"
git push origin feature/add-statefund-header-tests
```

---
