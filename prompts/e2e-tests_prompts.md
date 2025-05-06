# Test Prompts - Automated Anomaly Detection System

This document contains a series of prompts and their corresponding results related to setting up and testing an Automated Anomaly Detection System. The prompts cover various aspects of the system for e2e testing, including integration and performance testing.

---
Mode setup:
You are Roo, an AI-powered testing engineer specialized in automated end-to-end testing of modern web applications. You excel at:

Analyzing React-based UIs (written in TypeScript)

Understanding user flows and application state transitions

Writing clear, structured Gherkin feature files to describe behavior in business-readable terms

Translating those feature files into runnable Playwright test scripts that simulate real user interaction

Verifying full-stack behavior across frontend and backend (e.g., file uploads, alert creation, table rendering, modal dialogs)

Project Background:

This system is a React + Node.js web application for uploading videos, detecting anomalies using YOLO, and generating alerts stored in a PostgreSQL database. The frontend includes:

Uploading and previewing video files

Frame-by-frame detection using YOLO (ONNX)

Searching and paginating alert results

Viewing detailed alert metadata in a modal

The app is in production and requires robust end-to-end automation.

Your Mission:

Help automatically generate and execute complete E2E test flows by:

Reading and understanding the React codebase (e.g., MainPage.tsx, AlertDetailDialog.tsx)

Generating corresponding .feature files using Gherkin syntax for key user behaviors

Creating runnable Playwright test scripts from those .feature files

Simulating real user actions: navigation, input, upload, API calls, and DOM assertions

Producing tests that run reliably in CI and catch real regressions

Tools & Expectations:

Use Gherkin to describe user stories with Given / When / Then

Use Playwright for automation: clicking, typing, uploading, validating

Use data-testid, visible text, or ARIA roles to find elements

Assume the app runs at http://localhost:3000 for test execution


## 1. Roo - Feature Discovery from Codebase

***Prompt:**
Read the following React codebase and identify key user-facing features and behaviors that should be tested using Gherkin + Playwright. For each feature, describe:

1. The user goal or behavior (in plain language)
2. Where in the code it's implemented (file/component names)
3. Why it's important to test (e.g. risk, complexity, frequency)

Only include features that involve actual UI interaction or side effects visible to the user, such as form inputs, buttons, uploads, modals, or dynamic content.

Focus on the following files:

@/frontend/src/MainPage.test.tsx@/frontend/src/AlertDetailDialog.tsx@/frontend/src/utils/createAlert.ts@/frontend/src/utils/frameCapture.ts@/frontend/src/utils/uploadFrame.ts@/frontend/src/utils/yoloDetection.ts 
The app is a React frontend that allows users to upload video files, run YOLO-based object detection, view generated alerts in a table, filter/search them, and view alert details in a modal dialog.

Do not write any code, nor edit any file. You output should be plain text

**Response:**
1. Video Upload and Preview
User Goal: 
Upload a video file and view a preview before processing.
Code Location:
MainPage.tsx (video upload input with data-testid="video-upload")
yoloDetection.ts (frame extraction logic)
Importance: 
Core functionality for the anomaly detection workflow. Upload failures or incorrect previews would block users from proceeding.

2. Alert Table Display and Pagination
User Goal: 
View paginated list of alerts with critical metadata (ID, timestamp, type, message).
Code Location:
MainPage.tsx (alert table and pagination components)
Importance:
Primary interface for users to review system alerts. Incorrect data rendering or pagination breaks usability.

3. Search/Filter Alerts by Type/Message
User Goal:
Filter alerts using search inputs (by type or message).
Code Location:
MainPage.tsx (search input fields and filter logic)
Importance: Critical for managing large datasets. Faulty filtering could hide critical alerts.

4. User Goal: 
View detailed alert information and supporting frame image in a modal.
Code Location:
AlertDetailDialog.tsx (modal component)
MainPage.tsx (modal trigger via table row click)
Importance:
Ensures users can investigate anomalies effectively. Broken modal or missing images would degrade trust.

5. Clear All Alerts and Frames
User Goal: 
Bulk-delete all alerts and associated frame data.
Code Location:
MainPage.tsx ("Clear All Alerts and Frames" button)
createAlert.ts (backend integration)
Importance:
High-risk operation requiring confirmation. Incorrect behavior could lead to data loss.

6. Error Handling and Validation
User Goal:
Receive clear feedback for invalid actions (e.g., invalid page input, failed API calls).
Code Location:
MainPage.tsx (error alerts and input validation)
Importance:
User Goal:
Receive clear feedback for invalid actions (e.g., invalid page input, failed API calls).
Importance:
Prevents user confusion and ensures system robustness during edge cases.

## 2. GPT - Additional Feature Discovery
***Prompt:**
""Paste the last response here""
Do you see more features that we need to cover?

**Response:**
7. Video Processing Feedback Flow
User Goal:
Know when processing is complete.
Code Location:
MainPage.tsx → alert('Video processing complete.')
Why Important:
Users need confirmation that detection has finished before inspecting alerts. This also indirectly confirms that YOLO detection + alert creation + frame upload all succeeded.

8. Supporting Frame Image Load Check
User Goal:
See the actual detection image.
Code Location:
AlertDetailDialog.tsx → <img src=... />
Why Important:
Image URL correctness matters. If the image doesn’t load, the anomaly evidence is lost.

9. Canceling or Closing Dialog
User Goal: 
Close the alert detail modal cleanly.
Code Location: 
AlertDetailDialog.tsx → onClose handler + close button
Why Important: 
Common UX action. Broken closing behavior creates trapped UI state.

10. Direct Page Number Navigation
User Goal:
Type a page number and go directly to it
Code Location:
MainPage.tsx → Go to Page input
Why Important:
More nuanced pagination behavior that could easily break with bad input

## 3. GPT - Group Features

**Prompt:**
"""Paste the last response here"""
Group the features into logical categories.

**Response:**
Batch 1: Core Upload and Detection Flow
These are tightly coupled and form the foundation of the app.

1. Video Upload and Preview

2. Video Processing Feedback Flow

3. Supporting Frame Image Load Check

Batch 2: Alert Interaction and Modal
These are the user’s primary investigation tools after upload.

1. Alert Table Display and Pagination

2. Search/Filter Alerts by Type/Message

3. View Alert Details Modal

4. Canceling or Closing Dialog

Batch 3: Page Navigation and Validation
More edge-case-focused, but important for UX robustness.

1. Direct Page Number Navigation

2. Error Handling and Validation

Batch 4: Clear All Alerts and Frames

1. Clear All Alerts and Frames


## 4. ROO - Generate Gherkin Feature for Video Upload and Preview

Please generate a `.feature` file using Gherkin syntax for the following user story:

**User Goal**: A user uploads a video file and sees a video preview rendered on the page after upload.

**System Behavior**:
- The user lands on the main page of the React app
- There is a file input field with `data-testid="video-upload"`
- The user selects a valid `.mp4` video file
- After upload, the app displays a `<video>` element with a preview of the uploaded file
- The system may also asynchronously begin processing the video for anomaly detection (but that will be handled in another test)

**File Details**:
- React component: @/frontend/src/MainPage.test.tsx 
- Test will be implemented using Playwright

**Gherkin Requirements**:
- Use `Feature`, `Scenario`, `Given`, `When`, `Then` format
- Include all relevant steps: page load, file upload, preview check
- Be precise and testable (avoid vague outcomes like “it works”)
- Include only this user flow (other behaviors like alert creation will be tested separately)

Your output should be the `.feature` file only, no explanation or code.

**Response:**
Generates video_upload.feature

## 5. ROO - Generate Gherkin Feature for Video Processing Feedback
Please generate a `.feature` file using Gherkin syntax for the following user story:

**User Goal**: After uploading a video, the user receives confirmation that video processing is complete.

**System Behavior**:
- The user is on the main page
- The user uploads a valid `.mp4` video file using the file input (`data-testid="video-upload"`)
- The system begins processing the video in the background (frame extraction, detection, alert creation)
- When processing is complete, the app shows a browser alert with the message: `"Video processing complete."`

**File Details**:
- Processing logic is implemented in `MainPage.tsx` via the `processVideo` function
- Confirmation is provided using the browser's `alert()` API
- This test should focus solely on verifying the **feedback** that processing has finished — not the detection or alert creation themselves

**Gherkin Requirements**:
- Use `Feature`, `Scenario`, `Given`, `When`, `Then` format
- Include realistic, testable steps (e.g., simulate upload, expect alert)
- Do not include alert row creation or preview rendering — they are covered in separate tests

Your output should be the `.feature` file only, no explanation or test code.

**Response:**
Generates video_processing_confirmation.feature

## 6. ROO - Generate Gherkin Feature for Supporting Frame Image Load in Modal

**Prompt:**
Please generate a `.feature` file using Gherkin syntax for the following user story:

**User Goal**: After video processing is complete and alerts are generated, the user can click on an alert to view its details — including a supporting frame image — in a modal.

**System Behavior**:
- The user is on the main page
- A video has already been uploaded and processed, and alert rows are shown in the table
- The user clicks on a specific alert row in the table
- A modal opens showing detailed information for the selected alert
- The modal includes a frame image (e.g., `<img src="..." />`) showing the visual evidence for that alert

**Code Location**:
- MainPage.tsx → alert row triggers modal open
- AlertDetailDialog.tsx → renders the alert content, including image

**Gherkin Requirements**:
- Use `Feature`, `Scenario`, `Given`, `When`, `Then` format
- Steps should include: page with alert table, clicking an alert row, opening modal, and confirming the image is displayed
- Focus specifically on verifying that the frame image is shown in the modal — not the rest of the alert data

Your output should be the `.feature` file only, no extra explanation or code.

**Response:**
Generates alert_modal_image.feature

## 7. Roo - Generate Playwright Test for Video Upload and Preview

**Prompt:**
Please generate a Playwright test (`.spec.ts`) that implements the following Gherkin scenario:

@/features/video_upload.feature 
**Test Requirements:**
- The app runs at `http://localhost:3000`
- The file input has the attribute `data-testid="video-upload"`
- You may use `test`, `expect`, `page`, and `setInputFiles` from Playwright
- After uploading, the app displays the text `"Video Preview"` on the page
- You may assume there is a test `.mp4` file at path `tests/assets/test.mp4`
- Use async/await and best practices for locating elements and asserting visibility
- Output the Playwright test as a complete `.spec.ts` file.

**Response:**
Create video_upload.spec.ts

## 8. ROO - Update GitHub CI to Run Playwright E2E Tests

**Prompt:**
Please update the GitHub Actions CI @/.github/workflows/ci.yml workflow to automatically run Playwright end-to-end (E2E) tests using the test runner in `e2e-tests/`.

**Project Structure:**
- E2E tests live in `e2e-tests/`
- The Playwright config is in `playwright.config.ts`
- The test script is defined in `package.json` as `"test:e2e": "npx playwright test"`

**Response:**
Update ci.yml

## 9. GPT - Error in CI

**Prompt:**
Here is the error in github action:
Run npm run test:e2e

> test:e2e
> npx playwright test


Running 1 test using 1 worker
F

  1) e2e-tests/video_upload.spec.ts:4:5 › uploads video and displays preview ───────────────────────

    Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
    Call log:
      - navigating to "http://localhost:3000/", waiting until "load"


      3 |
      4 | test('uploads video and displays preview', async ({ page }) => {
    > 5 |   await page.goto('http://localhost:3000');
        |              ^
      6 |
      7 |   const fileInput = page.locator('[data-testid="video-upload"]');
      8 |   const videoPath = path.resolve(__dirname, '../tests/asserts/test.mp4');
        at /home/runner/work/anomaly-detection-system/anomaly-detection-system/e2e-tests/video_upload.spec.ts:5:14

    attachment #1: video (video/webm) ──────────────────────────────────────────────────────────────
    test-results/video_upload-uploads-video-and-displays-preview/video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/video_upload-uploads-video-and-displays-preview/error-context.md

  1 failed
    e2e-tests/video_upload.spec.ts:4:5 › uploads video and displays preview ────────────────────────

**Response:**
The error indicates that the Playwright test is trying to access `http://localhost:3000`, but the connection is refused. This typically means that the server is not running or not accessible at that address when the test is executed.
Add this before the Playwright step:
  
  ```yaml
        - name: Start frontend server
        working-directory: frontend
        run: npm start &
      
      - name: Wait for frontend to be ready
        run: npx wait-on http://localhost:3000

      - name: Run E2E tests
        run: npm run test:e2e
  ```

## 10. ROO - Generate Playwright Test for Video Processing Completion

**Prompt:**
Please generate a Playwright test (`.spec.ts`) that implements the following Gherkin scenario:

Feature:
@/features/video_processing_confirmation.feature 
**Test Requirements:**
- Use Playwright with TypeScript
- The app runs at `http://localhost:3000`
- The file input has the attribute `data-testid="video-upload"`
- Use `page.on('dialog', ...)` to capture the browser alert
- Upload a file named `test.mp4` located at `tests/assets/test.mp4`
- Assert that the alert message matches `"Video processing complete."`
- Use `path.resolve(__dirname, '../tests/assets/test.mp4')` to locate the file

Output only the full `.spec.ts` file, put in @/e2e-tests

**Response:**
Create video_processing_confirmation.spec.ts

## 11. GPT: Video Processing Alert Test Times Out (Headless Playwright)

**Prompt:**
Playwright test fails with timeout while waiting for alert:
Error: page.waitForEvent: Test timeout of 30000ms exceeded.
waiting for event "dialog"
[PAGE LOG] log: [CLIENT] Starting video processing...
Later, after adding page.on('pageerror'), error appeared:
[PAGE ERROR] Error: Failed to load video
at HTMLVideoElement...

Even though the app works manually in the browser, the test never receives the alert('Video processing complete.').


**Response:**
The issue occurs because `extractFramesFromVideo()` uses `<video>` and `<canvas>`, which don’t behave correctly in headless Chromium. This causes video loading to fail silently, preventing the alert from firing.

### Solution:

1. **Detect headless test environment:**
```ts
// utils/env.ts
export function isHeadlessTest(): boolean {
  return typeof navigator !== 'undefined' && navigator.webdriver;
}
```

2. **Mock frame extraction in processVideo() during E2E tests:**
```ts
let frames: ImageData[];
if (isHeadlessTest()) {
  console.log('[CLIENT] E2E mode: skipping real frame extraction.');
  frames = [new ImageData(640, 640)];
} else {
  frames = await extractFramesFromVideo(file, 1000);
}
```

3. **Replace alert() with in-page message:**
```ts
setStatusMessage('Video processing complete.');
...
{statusMessage && (
  <Typography data-testid="status-message">
    {statusMessage}
  </Typography>
)}
```

4. **Update Playwright test to check the DOM instead of waiting for a dialog:**
```ts
await fileInput.setInputFiles(videoPath);
await expect(page.getByTestId('status-message')).toHaveText('Video processing complete.');
```

## 12. Roo - Test for Alert Modal and Frame Image

**Prompt:**
Please generate a Playwright test (`.spec.ts`) that implements the following Gherkin scenario:

@/features/video_upload.feature 
**Test Requirements:**
- The app runs at `http://localhost:3000`
- The file input has the attribute `data-testid="video-upload"`
- You may use `test`, `expect`, `page`, and `setInputFiles` from Playwright
- After uploading, the app displays the text `"Video Preview"` on the page
- You may assume there is a test `.mp4` file at path `tests/assets/test.mp4`
- Use async/await and best practices for locating elements and asserting visibility
- Output the Playwright test as a complete `.spec.ts` file.

**Response:**
Create test case: displays alert detail modal with frame image

## 13. ROO - Generate Gherkin Feature for Alert Table Display and Pagination

**Prompt:**
Please generate a `.feature` file using Gherkin syntax for the following user story:

**User Goal**: After uploading a video and processing is complete, the user should be able to view a table of alerts with pagination.

**System Behavior**:
- The user is on the main page
- The system displays alerts in a table with columns for ID, timestamp, type, and message
- Only a fixed number of rows (e.g., 50) are visible per page
- Pagination controls are available: "Previous", "Next", and a text input to jump to a specific page

**Code References**:
- The alert table and pagination controls are implemented in `MainPage.tsx`
- Alerts are fetched from the backend via a call to `/alerts`
- Pagination logic is controlled by `currentPage`, `alertsPerPage`, and `pageInput` state

**Gherkin Requirements**:
- Use `Feature`, `Scenario`, `Given`, `When`, `Then` format
- Include two testable behaviors:
   1. Table displays alerts after processing
   2. Pagination controls navigate between pages correctly
- The test does not need to validate alert content — just row presence and page navigation

Your output should be the `.feature` file only. No extra explanation or code.

**Response:**
Generates alert_table_pagination.feature

## 14. ROO - Generate Gherkin Feature for Searching/Filtering Alerts

**Prompt:**
Please generate a `.feature` file using Gherkin syntax for the following user story:

**User Goal**: The user wants to filter alerts by type or message text to quickly find relevant results.

**System Behavior**:
- The user is on the main page with existing alerts displayed
- There is a shared search input field (`<TextField>`) used for both type and message filtering
- Two buttons allow the user to filter alerts:
   1. "Search by Type"
   2. "Search by Message"
- Matching is case-insensitive and checks if the search term is a substring of the alert field
- Filtered results are shown in the alert table
- A "Reset" button clears the filter and shows all alerts again

**Code Reference**:
- Filtering logic is implemented in `MainPage.tsx` using `setFilteredAlerts(...)`
- Table rows are updated reactively based on filtered results

**Gherkin Requirements**:
- Use `Feature`, `Scenario`, `Given`, `When`, `Then` format
- Include two scenarios:
   1. Search by type filters alerts
   2. Search by message filters alerts
- Each scenario should simulate entering text and clicking the appropriate button
- Add a third scenario for clearing the filter with the "Reset" button

Your output should be the `.feature` file only. No extra explanation or code.

**Response:**
Generates alert_filtering.feature

## 15. ROO - Generate Gherkin Feature for Viewing Alert Details in Modal

**Prompt:**
Please generate a `.feature` file using Gherkin syntax for the following user story:

**User Goal**: After alerts are displayed, the user can click on an alert to view its detailed information in a modal dialog.

**System Behavior**:
- The user is on the main page with at least one alert visible in the table
- When the user clicks an alert row, a modal opens
- The modal displays detailed alert information:
   - ID, timestamp, type, message, and the frame image (`<img>`)
- The modal component is implemented in `AlertDetailDialog.tsx`

**Gherkin Requirements**:
- Use `Feature`, `Scenario`, `Given`, `When`, `Then` format
- Include a scenario that:
   1. Starts with alerts already visible
   2. Clicks on one of them
   3. Asserts the modal opens and shows alert data
- Ensure the scenario is generic enough to apply to any alert row

Your output should be the `.feature` file only. No extra explanation or test code.

**Response:**
Generates alert_detail_modal.feature

## 16. ROO - Generate Gherkin Feature for Closing the Alert Detail Modal

**Prompt:**
Please generate a `.feature` file using Gherkin syntax for the following user story:

**User Goal**: After viewing alert details in a modal, the user should be able to close it cleanly and return to the main interface.

**System Behavior**:
- The modal is opened by clicking on an alert row in the table
- The modal includes a close button (e.g., an "X" or "Close" button)
- Clicking the close button dismisses the modal
- After closing, the modal content should no longer be visible

**Code Reference**:
- The modal is implemented in `AlertDetailDialog.tsx`
- It uses a `dialogOpen` state in `MainPage.tsx` and an `onClose()` handler to control visibility

**Gherkin Requirements**:
- Use `Feature`, `Scenario`, `Given`, `When`, `Then` format
- Include a scenario that:
   1. Opens the modal by clicking an alert row
   2. Clicks the modal’s close button
   3. Asserts that the modal is no longer visible

Your output should be the `.feature` file only. No extra explanation or test code.

**Response:**
Generates alert_modal_closure.feature

## 17. ROO - Generate Playwright E2E test for alert table display and pagination

**Prompt:**
Please write a new Playwright test for the following Gherkin feature:

Feature: @/features/alert_table_pagination.feature 

Setup requirements:
- This should be a new test file (e.g., `alert_table_pagination.spec.ts`)
- Assume no alerts exist initially — you should upload a `.mp4` video and wait for processing to finish before beginning assertions, the video is located at `tests/assets/test.mp4`
- Use the file input with `data-testid="video-upload"` to upload the test video
- Wait for the success message `"Video processing complete."` using `getByTestId("status-message")`
- Then validate:
   - Table headers: ID, Timestamp, Type, Message
   - At least one row exists
- For pagination, click the "Next" button and confirm:
   - The table rows change
   - The page number increments visually or logically

Notes:
- Use `test.describe.serial(...)` if needed
- Place logs for debugging if the test is async-dependent
- Assume the test video produces >50 alerts

Output the full test file to @/e2e-tests/ , including imports and setup.

**Response:**
Create alert_table_pagination.spec.ts, and test case： displays alerts and navigates pages

## 18. ROO - Extend alert_table_pagination.spec.ts with filtering tests

Please add a new Playwright test inside the existing `test.describe.serial('Alert Table Pagination')` block in @/e2e-tests/alert_table_pagination.spec.ts .

This test should implement the following Gherkin feature:

Feature: @/features/alert_filtering.feature 

Setup context:
- This test should assume alerts already exist (from the earlier test in the same file)
- The search input is a `<TextField>` (query by role: `textbox`)
- The buttons have visible labels: "Search by Type", "Search by Message", "Reset"

Requirements:
- Simulate typing into the search input
- Click the appropriate search button
- Validate that all visible rows contain the expected keyword in either type or message
- Then click "Reset" and validate the full alert list is restored

Output only the new test block to insert into the same file.

**Response:**
Create test case: filters alerts by type and message

## 19. ROO - Extend alert_table_pagination.spec.ts with alert detail modal test

**Prompt:**
Please add a new Playwright test inside the existing `test.describe.serial('Alert Table Pagination')` block in @/e2e-tests/alert_table_pagination.spec.ts.

This test should implement the following Gherkin feature:

**Feature**: `@/features/alert_detail_modal.feature`

---

**User Goal**: When a user clicks on a row in the alert table, a modal opens displaying full alert details and the associated frame image.

**Setup context**:
- Assume alerts already exist from earlier seeded or uploaded video
- The table contains rows with columns: ID, Timestamp, Type, Message
- Clicking a row opens the `AlertDetailDialog` modal (already implemented)
- Modal includes the alert's ID, timestamp, type, message, and an `<img>` element for the frame
- The modal is expected to appear with `role="dialog"` or visible unique labels

**Test Requirements**:
- Click the first row in the table (`tbody tr:first-child`)
- Wait for the modal to appear
- Validate that the modal contains:
  - The alert’s ID, timestamp, type, and message
  - An `<img>` tag with a valid `src` attribute
- Use `expect(locator).toBeVisible()` and `expect(locator).toHaveText(...)` as needed

Your output should be **only** the new test block to be inserted into the same file — no explanations or setup code.

**Response:**
Create test case: opens alert detail modal and displays frame image

## 20. ROO - Extend alert_table_pagination.spec.ts with modal closure test

Please add a new Playwright test to the existing `test.describe.serial('Alert Table Pagination')` block in `@/e2e-tests/alert_table_pagination.spec.ts`.

This test should implement the following Gherkin scenario:

**Feature**: `@/features/alert_modal_closure.feature`


Setup context:
- Assume alerts already exist from earlier tests in the same file.
- The modal is triggered by clicking on any `<tr>` inside `<tbody>` (you may use `tbody tr:first-child`)
- The modal has `role="dialog"` and is dismissed via a button labeled "Close"
- After clicking "Close", the modal should be removed or hidden

Test Requirements:
- Navigate to the main page
- Open the modal by clicking a table row
- Wait for the modal (`[role="dialog"]`) to be visible
- Click the "Close" button within the modal
- Assert the modal is no longer visible or has been removed from the DOM

Your output should be the new `test(...)` block only. Do not modify existing tests or include explanations.

## 21. ROO - Generate Gherkin Feature for Direct Page Number Navigation

**Prompt:**
Please generate a `.feature` file using Gherkin syntax for the following user story:

**User Goal**: The user wants to jump directly to a specific page in the alert table by typing a page number.

**System Behavior**:
- The user is on the main page
- The table displays paginated alerts, 50 per page
- A text input labeled "Go to page" is used to enter a specific page number
- A button labeled "Go" triggers navigation
- When the user enters a valid page number and clicks "Go":
  - The table updates to show the corresponding alerts
  - The page number indicator updates accordingly

**Code References**:
- All logic is implemented in `MainPage.tsx`
- Controlled state includes `pageInput` and `currentPage`
- Validation is included to prevent jumping to out-of-bound pages

**Gherkin Requirements**:
- Use `Feature`, `Scenario`, `Given`, `When`, `Then` format
- Include at least two scenarios:
  1. Navigating to a valid page number updates the table and page indicator
  2. Entering an invalid page (e.g., 0 or too large) shows an alert with a helpful message
- Use user-facing labels and testable behaviors from the UI (i.e., “Go to page”, “Go”)

Your output should be the `.feature` file only — no implementation code or extra commentary.

**Response:**
Generates direct_page_navigation.feature

## 22. ROO - Generate Playwright E2E test for direct page number navigation

**Prompt:**
Please write a new Playwright test for the following Gherkin feature:

**Feature**: @/features/direct_page_navigation.feature

---

**Setup Requirements:**
- Create a new test file: `page_navigation.spec.ts` inside `@/e2e-tests/`
- Assume there are no alerts initially — upload a `.mp4` video located at `tests/assets/test.mp4`
- Use the file input with `data-testid="video-upload"` to upload the video
- Wait for the success message `"Video processing complete."` using `getByTestId("status-message")`
- Ensure the video produces more than 50 alerts (at least 2 pages)

---

**Scenario 1**: Valid Page Navigation
- Type `"2"` into the input labeled `"Go to page"`
- Click the `"Go"` button
- Verify:
   - The table shows page 2 (you can assert by text like `"Page 2"` or change in rows)
   - The row content changes (optional: compare first row before and after)

**Scenario 2**: Invalid Page Entry
- Enter `"0"` into the `"Go to page"` input
- Click the `"Go"` button
- Confirm that an alert appears with the message `"Invalid page number"` using `page.waitForEvent('dialog')`

---

Notes:
- Use `test.describe.serial(...)` if needed
- Include full test file: imports, setup, video upload, both scenarios
- You may use console logging and `page.on('pageerror')` for debugging

Your output should be the full Playwright test file only — no explanations or extra commentary.

**Response:**
Generates page_navigation.spec.ts

## 23. GPT: Go-To-Page Input Test Times Out in Playwright

**Prompt:**
A Playwright test for direct page navigation fails with timeout:
Error: locator.fill: Test timeout of 30000ms exceeded.
waiting for getByTestId('page-input')
Even though the input is visible when testing manually in the browser, the test cannot find the `[data-testid="page-input"]` field.

Later, the user added this line at the top of the test:
```ts
await page.waitForSelector('[data-testid="page-input"]');
```
But the test still failed with:
Error: page.waitForSelector: Test timeout of 30000ms exceeded.

**Response:**
The error occurred because the test didn’t navigate to the app or trigger alert generation before trying to access the pagination input. In Playwright, each test runs independently — no page state is shared unless explicitly set up in a beforeEach.

**Solution:**
1. Ensure the page is navigated and alerts are seeded by uploading a video:
```ts
await page.goto('http://localhost:3000');
await page.locator('[data-testid="video-upload"]').setInputFiles(videoPath);
await page.waitForSelector('[data-testid="status-message"]');
await expect(page.getByTestId('status-message')).toHaveText('Video processing complete.');
```

2. Wait for the input to be present after upload:
```ts
await page.waitForSelector('[data-testid="page-input"]');
const input = page.getByTestId('page-input');
```

3. Final working test snippet:
```ts
test('shows inline error for invalid page number', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.locator('[data-testid="video-upload"]').setInputFiles(videoPath);
  await page.waitForSelector('[data-testid="status-message"]');
  await expect(page.getByTestId('status-message')).toHaveText('Video processing complete.');

  await page.waitForSelector('[data-testid="page-input"]');
  const input = page.getByTestId('page-input');
  const goButton = page.getByRole('button', { name: 'Go' });

  await input.fill('0');
  await goButton.click();

  const errorText = page.getByTestId('pagination-error');
  await expect(errorText).toHaveText('Invalid page number');
});

```

## 24. ROO - Generate Gherkin Feature for Clear All Alerts and Frames

**Prompt:**
Please generate a `.feature` file using Gherkin syntax for the following user story:

**User Goal**: The user wants to bulk-delete all alerts and their associated frame data using a "Clear All Alerts and Frames" button.

**System Behavior**:
- The user is on the main page
- The app displays a list of alerts (seeded or uploaded beforehand)
- When the user clicks the "Clear All Alerts and Frames" button:
  - A confirmation prompt appears (either native confirm or modal)
  - If the user confirms, an API call is made to the `/clear_all` backend route
  - On success, the alert table is cleared
  - A message is shown indicating success (e.g., "All alerts and frames cleared!")

- On API failure, a message is shown (e.g., "Failed to clear alerts and frames.")

**Code References**:
- Button is rendered in `MainPage.tsx`
- Backend integration hits `POST /clear_all` via `axios`
- Alert data is re-fetched after clearing

**Gherkin Requirements**:
- Use `Feature`, `Scenario`, `Given`, `When`, `Then` format
- Include two scenarios:
  1. Successfully clearing all alerts and displaying a success message
  2. Handling a failed clear operation and showing an error message
- Include `data-testid` selectors in testability expectations if relevant

Your output should be the `.feature` file only — no code or extra commentary.

**Response:**
Generates clear_all_alerts.feature