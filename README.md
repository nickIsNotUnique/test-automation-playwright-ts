# test-automation-playwright-ts

[![Playwright Tests](https://github.com/nickIsNotUnique/test-automation-playwright-ts/actions/workflows/playwright.yml/badge.svg)](https://github.com/nickIsNotUnique/test-automation-playwright-ts/actions/workflows/playwright.yml)
![Status](https://img.shields.io/badge/status-draft-lightgrey)

A starter/test automation repository using Playwright with TypeScript. This project provides patterns, recommended configuration, and examples for end-to-end web testing with Playwright test runner, TypeScript, and modern CI practices.

## Overview

This repository demonstrates a pragmatic setup for automated UI tests using Playwright and TypeScript. It is intended as a foundation you can adapt to your own product tests. Key goals:
- Fast, reliable E2E tests using Playwright Test
- TypeScript-first developer experience
- Recommended CI integration and reproducible local runs
- Support for traces, and HTML reports for debugging failures

---

## Prerequisites

- Node.js (~22.20.0)
- TypeScript (~5.9.2)
- yarn (~1.22.22)
- Playwright (~1.55.0)

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

- .github/workflows/    — CI workflows
- node_modules/
- playwright-report/
- test-results/
- tests/                — Test files (e.g., *.spec.ts)
- .gitignore
- package.json
- playwright.config.ts  — Playwright test runner configuration
- README.md
- tsconfig.json
- yarn.lock

---

## CI: GitHub Actions

This project uses GitHub Actions for continuous integration. 
Available pipelines:

### `playwright.yml` - Playwright Tests

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

## Resources

- Playwright docs: https://playwright.dev/
- Playwright GitHub examples: https://github.com/microsoft/playwright
