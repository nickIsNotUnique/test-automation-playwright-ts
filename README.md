# test-automation-playwright-ts

[![Playwright Tests](https://github.com/nickIsNotUnique/test-automation-playwright-ts/actions/workflows/playwright.yml/badge.svg)](https://github.com/nickIsNotUnique/test-automation-playwright-ts/actions/workflows/playwright.yml) ![Status](https://img.shields.io/badge/educational-project-green)

This repository serves as a **practical demonstration** of implementing Playwright test automation with GitHub Actions CI/CD. Created as companion code for my article series [ "Playwright testing with GitHub Actions"](https://nickisnotunique.substack.com/profile/posts). This project provides patterns, recommended configuration, and examples for end-to-end web testing with Playwright test runner, TypeScript, and modern CI practices.

## Overview

This repository demonstrates a pragmatic setup for automated UI tests using Playwright and TypeScript. It is intended as a foundation you can adapt to your own product tests. Key goals:

- Fast, reliable E2E tests using Playwright Test
- TypeScript-first developer experience
- Recommended CI integration and reproducible local runs
- Support for traces, and HTML reports for debugging failures

---

## Key Features

- **CI/CD Workflows**: Full suite, auto smoke tests, manual smoke runs
- **Optimized Caching**: Yarn cache for faster CI runs
- **Slack Integration**: Automated notifications for test results

---

## Prerequisites

- Node.js (≥ 22.20.0; the repo includes [`.nvmrc`](.nvmrc) — run `nvm use` if you use nvm)
- TypeScript (~5.9.2)
- yarn (~1.22.22)
- Playwright (~1.59.x)

On macOS below 15, WebKit-powered projects (`webkit`, `mobile-safari`) are skipped locally in [`playwright.config.ts`](playwright.config.ts); they still run on Linux CI. Set `PLAYWRIGHT_SKIP_WEBKIT=1` to force skipping WebKit on any host.

---

## Quick start

1. Clone the repository

   ```bash
   git clone https://github.com/nickIsNotUnique/test-automation-playwright-ts.git
   cd test-automation-playwright-ts
   ```

2. Install dependencies and Playwright browsers

   ```bash
   yarn install
   yarn playwright install
   ```

3. Verify your installation by running the test suite
   ```bash
   yarn playwright test
   ```

---

## Useful commands

- Run a single test file:
  ```bash
  yarn playwright test tests/example.spec.ts
  ```
- Run with grep (run only tests that match a tag):
  ```bash
  yarn playwright test --grep @smoke
  ```
- Debug a test with Playwright inspector:
  ```bash
  yarn playwright test --debug
  ```
- View test report:
  ```bash
  yarn playwright show-report
  ```

---

## Project structure

This section describes the project layout

```
├── .github/workflows/ # CI/CD workflows
├── tests/ # Test files (*.spec.ts)
├── .gitignore
├── package.json
├── playwright.config.ts
├── README.md
├── tsconfig.json
└── yarn.lock
```

---

## CI: GitHub Actions

This project uses GitHub Actions for continuous integration.
Available pipelines:

### `playwright.yml` - Playwright Tests

#### Summary:

- Runs on every push to main/master
- Executes complete test coverage
- Ideal for: Release validation, nightly builds

**Triggers:**

- Push to `main` or `master` branches
- Pull Request to `main` or `master` branches

**Functions:**

- Checks out code from repository
- Sets up Node.js (latest LTS version)
- Installs dependencies via Yarn
- Installs Playwright browsers with all dependencies
- Runs all Playwright tests (`yarn playwright test`)
- Uploads test results as artifacts

**Results:**

- **Report**: Playwright HTML report saved as artifact named `playwright-report`
- **Retention**: artifacts stored for 30 days
- **Timeout**: maximum execution time - 60 minutes
- **Platform**: runs on Ubuntu Latest
- Artifacts uploaded even if tests are cancelled or fail

---

### `auto-simple-suite.yaml` - Auto run simple suite

#### Summary:

- Triggers on PRs to main
- Runs critical path tests only
- Includes Slack notifications
- Ideal for: PR validation, quick feedback loops

**Triggers:**

- Pull Request to `main` branch
- Manual run via workflow_dispatch

**Functions:**
This workflow consists of **3 jobs**:

#### Job 1: `run-simple-suite`

- Checks out code
- Sets up Node.js version 22 with Yarn caching
- Installs dependencies
- Installs Chromium browser only
- **Runs smoke tests**: `yarn playwright test --project=chromium --grep @smoke`
- Uploads test results

#### Job 2: `post-slack-notification-started`

- Sends Slack notification about **test execution start**
- Message: "The simple suite pipeline started"
- Uses webhook from `SLACK_WEBHOOK_URL` secret

#### Job 3: `post-slack-notification-results`

- Depends on `run-simple-suite` completion
- Always runs (if: always())
- Sends Slack notification with **execution result**:
  - On success: "The simple suite pipeline succeeded"
  - On failure: "The simple suite pipeline failed"

**Results:**

- **Report**: test results saved as `simple-suite-results-{run_id}`
- **Retention**: artifacts stored for 7 days
- **Timeout**: maximum execution time - 15 minutes
- **Platform**: Ubuntu Latest
- **Notifications**: automatic Slack notifications about start and results
- Artifacts uploaded even if tests are cancelled or fail

---

### `run-simple-suite.yaml` - Run simple suite

#### Summary:

- Manually triggered via GitHub UI
- No notifications (focused testing)
- Ideal for: Ad-hoc testing, debugging, demos

**Triggers:**

- Manual run only via workflow_dispatch

**Functions:**

- Identical to `run-simple-suite` job from the auto-simple-suite workflow
- Checks out code
- Sets up Node.js version 22 with Yarn caching
- Installs dependencies
- Installs Chromium browser only
- **Runs smoke tests**: `yarn playwright test --project=chromium --grep @smoke`
- Uploads test results

**Results:**

- **Report**: test results saved as `simple-suite-results-{run_id}`
- **Retention**: artifacts stored for 7 days
- **Timeout**: maximum execution time - 15 minutes
- **Platform**: Ubuntu Latest
- **No Slack notifications**
- Artifacts uploaded even if tests are cancelled or fail

---

## Author

- GitHub: [@nickIsNotUnique](https://github.com/nickIsNotUnique)
- Articles: [Substack](https://nickisnotunique.substack.com/profile/posts)

This project is part of my article series "Playwright testing with GitHub Actions".

---

## Feedback & Contributions

Questions or suggestions? Feel free to:

- [Open an issue](https://github.com/nickIsNotUnique/test-automation-playwright-ts/issues)
- [Start a discussion](https://github.com/nickIsNotUnique/test-automation-playwright-ts/discussions)
- ⭐ Star this repo if you find it useful!

## Resources

- Playwright docs: https://playwright.dev/
- Playwright GitHub examples: https://github.com/microsoft/playwright
