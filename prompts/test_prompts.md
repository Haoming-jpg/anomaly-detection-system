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

## 3. Additional Tests for MainPage.tsx – Pagination, Reset, Clear

**Prompt:**

Please help me increase coverage for `MainPage.tsx` by testing:
- The “Clear All Alerts and Frames” button behavior (with mocked `window.confirm` and `axios.post`)
- Pagination: “Next”, “Previous”, and “Go to Page” controls
- The “Reset” button restoring search input and full alert list

Tests should use React Testing Library and properly mock axios.

**Result:**
- Added the following test cases to `MainPage.test.tsx`:
  - `clicking Clear All Alerts and Frames button calls axios.post and refreshes alerts`
  - `pagination Next button increments currentPage`
  - `pagination Previous button decrements currentPage`
  - `Go to page input sets currentPage correctly`
  - `Reset button clears search input and restores alerts`
- Used `jest.fn()` to mock `window.confirm` and `window.alert`
- Used `Array.from()` to simulate multiple alerts for pagination
- All tests passed with `npm run test` and contributed to increased code coverage

## 4. MainPage.tsx - File Upload and Dialog Render Coverage

**Prompt:**

Help me add a test that covers the `videoFile` preview and `AlertDetailDialog` rendering in `MainPage.tsx`.  
The test should:
- Simulate a video file being uploaded via file input
- Verify the "Video Preview" section is shown
- Click a row in the alert table and verify the dialog opens
- Avoid real video/canvas processing by mocking required APIs

Ensure:
- `extractFramesFromVideo` and `runYoloDetection` are mocked
- `canvas.getContext` and `URL.createObjectURL` are mocked
- Text queries scoped using `within(dialog)` to avoid duplicates

**Result:**
- Added a test `renders video preview and alert dialog when applicable` to `MainPage.test.tsx`
- Used `data-testid="video-upload"` to locate the file input
- Mocked canvas and object URL APIs with:
  - `Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', ...)`
  - `global.URL.createObjectURL = jest.fn(...)`
- Used `within(dialog).getByText(...)` to resolve multiple matches in the DOM
- Increased coverage of `MainPage.tsx` to 61.9% lines and 87.5% functions

## 5. Unit Test for createAlert.ts

**Prompt:**

Please help me write a unit test for the utility function `createAlertFromDetection(detection, frameUrl)` in `createAlert.ts`.  
It sends a POST request to the backend (`/alerts`) using Axios and constructs an alert object based on detection results.

The test should:
- Mock `axios.post`
- Pass a dummy detection object
- Validate the constructed payload (frame_url, type, message, timestamp)
- Allow the function to generate the timestamp internally
- Use `expect.objectContaining` and `expect.any(String)` to handle dynamic values

**Result:**
- Created `createAlert.test.ts`
- Covered 100% of `createAlert.ts`
- Verified Axios POST call with:
  - type = detection.classId
  - message contains score
  - frame_url is passed correctly
  - timestamp is auto-generated

## 6. Unit Test for frameCapture.ts

**Prompt:**

Help me write tests for `captureFrameAsBlob(canvas)` in `frameCapture.ts`.  
This function wraps `canvas.toBlob()` in a promise and either resolves with the blob or rejects if null.

The test should:
- Create a mock canvas with a working `toBlob` that resolves with a blob
- Create a second test where `toBlob` returns `null` and the function rejects with an error

**Result:**
- Created `frameCapture.test.ts`
- Covered both branches of the `if (blob) ... else ...` logic
- Asserted that rejection throws: `Canvas conversion to blob failed.`
- Achieved 100% branch and line coverage for `frameCapture.ts`

## 7. Full Coverage for createAlert.ts with Fallback Handling

**Prompt:**
 
Help me write a second test for `createAlertFromDetection(detection, frameUrl)` in `createAlert.ts` to cover the fallback case.  
The function uses:
  type: classNames[detection.classId] || 'object'
  message: `Detected a ${...} with ${...}% confidence`

The test should:
- Use an invalid classId (e.g., 999)
- Confirm that type falls back to "object"
- Confirm that message still formats correctly
- Use expect.objectContaining for partial match

**Result:**
- Added a second test to `createAlert.test.ts`
- Passed `classId: 999` to trigger fallback
- Verified both `type: 'object'` and correct confidence string
- Achieved 100% branch and line coverage for `createAlert.ts`
