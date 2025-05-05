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