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

10. Invalid Video Format Upload
User Goal: 
Prevent non-video uploads
Code Location: 
accept="video/*" on input — enforced in HTML
Why Important:
This is user protection; worth testing that uploading a .txt or .jpg doesn’t trigger processing or preview

11. Direct Page Number Navigation
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

Video Upload and Preview

Video Processing Feedback Flow

Supporting Frame Image Load Check

Batch 2: Alert Interaction and Modal
These are the user’s primary investigation tools after upload.

Alert Table Display and Pagination

Search/Filter Alerts by Type/Message

View Alert Details Modal

Canceling or Closing Dialog

Batch 3: Page Navigation and Validation
More edge-case-focused, but important for UX robustness.

Direct Page Number Navigation

Error Handling and Validation

Batch 4: Critical Actions and Safety
Destructive actions with risk → deserves isolated, careful testing

Clear All Alerts and Frames

Invalid Video Format Upload

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
