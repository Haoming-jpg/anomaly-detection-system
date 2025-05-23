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

## 8. Tests for yoloDetection.ts - runYoloDetection and extractFramesFromVideo

**Prompt:**

Help write Jest tests to achieve 80%+ coverage in `yoloDetection.ts`. The file contains:
- `runYoloDetection(image: ImageData)` which uses ONNX Web runtime and filters low-confidence detections.
- `extractFramesFromVideo(file, frameInterval)` which uses video + canvas APIs to extract frames at timed intervals.

We needed to:
- Mock `InferenceSession.create` and `run` from `onnxruntime-web`
- Mock `Tensor` creation
- Simulate `video` tag events like `loadedmetadata` and `seeked`
- Handle unsupported browser APIs in Jest like `URL.createObjectURL` and `revokeObjectURL`

**Result:**
- Added a test that verifies `runYoloDetection` returns only high-confidence detections
- Mocked tensor input and output for YOLO postprocessing
- Added a test for `extractFramesFromVideo()` where canvas context is missing (rejection path)
- Added a test that simulates `loadedmetadata` and `seeked` to capture one frame and resolve successfully
- Mocked DOM internals: `video.duration`, `getContext`, `createElement`, `drawImage`, and `getImageData`
- Achieved full coverage for logical branches inside both exported functions

## 9. Test processVideo logic in MainPage.tsx

**Prompt:**

We need to test the `processVideo(file: File)` logic inside `MainPage.tsx`, which:
- Calls `extractFramesFromVideo`
- Iterates over video frames
- Runs `runYoloDetection` on each frame
- Filters detections by score
- Captures the frame via canvas
- Uploads the frame
- Calls `createAlertFromDetection`

All of these helpers are in `src/utils`. We want to verify this flow is executed using mocks for all dependencies.

**Result:**
- Added a test that simulates a video upload through the file input
- Mocked `extractFramesFromVideo` to return one `ImageData`
- Mocked `runYoloDetection` to return one high-confidence detection
- Mocked `captureFrameAsBlob` to return a `Blob`
- Mocked `uploadFrame` to return a mock URL
- Mocked `createAlertFromDetection` to be called with correct input
- Used `jest.requireMock` to ensure mock references match those used inside the component
- Added a global definition for `ImageData` to fix JSDOM environment error

This test triggers the actual `processVideo()` logic and verifies the detection pipeline is fully executed.

## 10. Test invalid page number alert in MainPage.tsx

**Prompt:**

We want to cover the `else` branch in the "Go to page" handler in `MainPage.tsx`, which alerts the user if the input page number is invalid. The logic looks like:

```ts
if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
  setCurrentPage(pageNumber);
} else {
  alert('Invalid page number');
}
```

## 11. Test alert on clear_all failure in MainPage.tsx

**Prompt:**

We want to cover the `catch` block of the `axios.post('/clear_all')` call in `MainPage.tsx`, which displays an alert on failure:

```ts
try {
  await axios.post('...');
  alert('All alerts and frames cleared!');
} catch (error) {
  console.error('Error clearing all:', error);
  alert('Failed to clear alerts and frames.');
}
```

## 12. Test search reset when query is empty in MainPage.tsx

**Prompt:**

We want to test the case when the search query is empty or whitespace, which should trigger a reset:

```ts
if (searchQuery.trim() === '') {
  setFilteredAlerts(alerts); // Reset to all
}
```
## 13. Test fetchAlerts error handling in MainPage.tsx

**Prompt:**

We want to cover the `catch` block in the `fetchAlerts()` function, which logs an error when the network call fails:

```ts
try {
  const response = await axios.get('...');
  setAlerts(response.data);
} catch (error) {
  console.error('Error fetching alerts:', error);
}
```

## 14. Test canvas context null case in processVideo (MainPage.tsx)

**Prompt:**

In `processVideo`, we want to test the branch where canvas context retrieval fails:

```ts
const ctx = canvas.getContext('2d');
if (!ctx) {
  console.error('Failed to get canvas context');
  return;
}
```

### 15. Test prompt for MainPage.lowConfidence.test.tsx

**Prompt:**
Write a test that verifies processVideo() logs "No high-confidence detections, skipping alert."
when `runYoloDetection` returns only low-confidence detections.

Requirements:
- Mock `runYoloDetection` to return detections with score < 0.5
- Mock `extractFramesFromVideo`, `captureFrameAsBlob`, etc.
- Use a separate test file to avoid Jest hoisting issues
- Use `console.log = jest.fn()` and assert it was called with the expected string

## 16. server.test.js - Testing Express backend

**Prompt:**
- GET `/alerts` returns a `200` status and an array of alerts
- Ensured DB pool (`db.end()`) is closed after tests to prevent Jest from hanging

### 17. POST /alerts endpoint test

**Prompt:**
Write a Jest + Supertest test to verify the POST /alerts endpoint correctly stores a new alert. Use a valid alert object with timestamp, type, message, and frame_url. Expect a 201 response and verify the returned object contains the same fields. Ensure you mock any database side effects or clean up after the test.

### 18. Test for GET / Root Route

**Prompt:**
Write a Jest + Supertest test for the GET / route of the backend API. The test should verify that the server responds with status 200 and the text 'Backend is running!'. Ensure this endpoint is covered for completeness and CI consistency.

**Result:**
 - Added a simple test to check the root endpoint (GET /)
 - Verified the response status is 200 and the body is 'Backend is running!'
 - Ensures base connectivity route is covered
 - Confirmed test passes locally and in CI

 beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

### 20. Test GET /alerts error handling

**Prompt:**

Write a Jest + Supertest test to cover the error-handling branch in the GET /alerts route.  
The test should:

- Mock `db.query` to throw an error
- Send a request to `/alerts`
- Assert the response status is 500
- Confirm the response body is `{ error: 'Internal server error' }`

This ensures the catch block is triggered and proper error feedback is returned to the client.

**Result:**

- Added a test under `GET /alerts (error case)` in `server.test.js`
- Used `mockRejectedValueOnce` to simulate a database failure
- Confirmed server returned 500 and the correct JSON payload
- Improved coverage for error handling logic in the backend

### 21. Test for POST /upload_frame route

Write a Jest + Supertest test that covers the following backend route:

```js
app.post('/upload_frame', uploadFrame.single('frame'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No frame uploaded.');
  }
  const frameUrl = '/frames/' + req.file.filename;
  res.json({ frameUrl: frameUrl });
});
```

### 20. Test for POST /clear_all route

**Prompt:**
Write a Jest + Supertest test for the `/clear_all` route which deletes all alerts and frames. Verify that the route returns status 200 and includes a success message in the response.

**Result:**
- Created test that calls `POST /clear_all`
- Verified it returns 200 and a success message
- Ensures backend cleanup logic is test-covered

### 21. /clear_all – Handle fs.readdir Failure

**Prompt:**
Write a Jest test for the /clear_all backend route that verifies the behavior when fs.readdir fails.

**Result:**
 - Added a test case that mocks fs.readdir to return an error.
 - Confirmed the server responds with status 500 and { error: 'Failed to clear frames' }.
 - Ensures robust error handling when filesystem access fails during cleanup.
 - Test included in server.test.js.

 ### 22. Test for POST /upload_frame with no file uploaded

**Prompt:**

Write a Jest + Supertest test for the `/upload_frame` endpoint in the backend API that covers the `if (!req.file)` logic:

```js
app.post('/upload_frame', uploadFrame.single('frame'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No frame uploaded.');
  }
  ...
});
```