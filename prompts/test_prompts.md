# Test Prompts - Automated Anomaly Detection System

This document contains a series of prompts and their corresponding results related to setting up and testing an Automated Anomaly Detection System. The prompts cover various aspects of the system, including unit testing.

---
Mode setup:
You are Roo, a software testing specialist and code quality enforcer with expertise in:

Writing unit tests for React components (TypeScript) and Node.js (JavaScript) backend

Using Jest and React Testing Library to create clear, modular, and high-coverage tests

Ensuring tests meet 80%+ code coverage and all code passes ESLint checks

Designing tests for frontend components (like MainPage.tsx, AlertDetailDialog.tsx) and utility functions (e.g., createAlert.ts, frameCapture.ts, uploadFrame.ts, yoloDetection.ts)

Testing backend API routes in server.js with supertest or direct function mocking

Following best practices in testing: mocking, isolation, clean-up between tests, and clear expectation setup

Participating in AI-assisted "vibe coding", where prompts are clear, task-driven, and focused on code correctness and maintainability

Project Background:

A React + Node.js system for uploading videos, detecting anomalies using YOLO, creating alerts, and displaying alert data stored in AWS RDS.

Needs solid unit test coverage to validate business logic, UI rendering, and backend API behaviors.

Your mission:

Help write, refine, and optimize unit tests and ensure the project achieves required testing standards.



## 1. Setup Jest with ts-jest and Add First Unit Test

**Prompt:**

"I want to run unit tests on my frontend React app. Help me configure Jest with TypeScript support using ts-jest, and write the first simple test for MainPage.tsx."

**Result:**
- Installed `ts-jest` and `jest-environment-jsdom`
- Created `jest.config.js` in frontend folder
- Added `setupTests.ts` to initialize testing-library matchers
- Added basic test in `MainPage.test.tsx` checking for "Search Criteria" heading
- Ran `npm run test` successfully
- Coverage report generated

## 2. Unit Tests for MainPage.tsx

**Prompt:**
Please help me write Jest unit tests for `MainPage.tsx`, a React component that:
- Displays a search input, search buttons, and a table of alert results.
- Fetches alerts from a backend (`axios.get(...)`) on mount.
- Supports searching alerts by type and message.
- Opens a dialog (`AlertDetailDialog`) when a row is clicked.

Please generate:
1. A test that checks if "Search Criteria" heading renders.
2. A test that mocks alerts fetching and checks if the alert table rows are rendered.
3. A test that types into search input, clicks "Search by Type", and checks if table filters correctly.
4. A test that clicks a table row and expects the AlertDetailDialog to open.

Use React Testing Library and jest.mock('axios').

**Result:**
- Created 3 new test cases in `MainPage.test.tsx`:
  - `fetches alerts and renders table rows`
  - `searches by type and filters table`
  - `clicking table row opens dialog`
- All tests passed using `npm test`
- Mocked Axios responses using `jest.mock('axios')`
- Verified dialog behavior, alert rendering, and filter logic
