## F-04: HTML Reports & Trace Viewer

### HTML Report (Scoreboard after the match)
- Run tests with HTML reporter: `npx playwright test --reporter=html`
- Open the report: `npx playwright show-report`
- Shows: pass/fail status, time taken, failure screenshots, error messages
- Report saved in `playwright-report/` folder

### Trace Viewer (Killcam replay)
- Run tests with trace recording: `npx playwright test --trace on`
- Open the trace: `npx playwright show-trace test-results/<test-folder>/trace.zip`
- Shows: step-by-step timeline of every action, screenshots at each step, network requests, console logs
- Best for debugging why a test failed — you can see exactly what the browser saw

### Config options (add to playwright.config.ts inside `use`):
- `screenshot: 'only-on-failure'` — auto-capture screenshot when test fails
- `trace: 'retain-on-failure'` — auto-record trace only for failed tests
- `video: 'on-first-retry'` — record video on first retry

### When to use what:
- Test passed but want a summary → HTML report
- Test failed and need to debug → Trace viewer
- Want a video recording → add `video: 'on'` to config