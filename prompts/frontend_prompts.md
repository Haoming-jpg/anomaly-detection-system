# Frontend Prompts - Automated Anomaly Detection System

This document records all AI prompts used for frontend development (React + TypeScript + Material-UI).

---

## 1. Setting up MainPage.tsx

**Prompt:**

"Help me create a React component for a Main Search Page using Material-UI. It should have:
- A Search Bar (TextField and Button)
- A Table (with columns: ID, Time, Type, Message)
- A Video Upload section (accept video files)
- A Video Player to preview uploaded videos.
Use TypeScript."

**Result:**
Generated `MainPage.tsx` with useState hooks, Material-UI components, file upload handler, and video preview.

---

## 2. Creating AlertDetailDialog.tsx

**Prompt:**

"Help me create a Material-UI Dialog component in React TypeScript. It should display:
- ID
- Timestamp
- Type
- Message
- Supporting Frame image
Props: `open`, `onClose`, `alert` (object with details)."

**Result:**
Generated `AlertDetailDialog.tsx` component with DialogTitle, DialogContent, and frame image rendering.

---

## 3. Making Search Results Table Dynamic

**Prompt:**

"Help me update a static Material-UI Table into a dynamic Table that renders rows based on a dummy alert array. Each row should open a modal dialog showing alert details when clicked. Use TypeScript."

**Result:**
Generated dynamic TableBody using `.map()` to loop over alerts, connected click event to AlertDetailDialog.

## 4. Implementing Search Filter for Alerts Table

**Prompt:**

"Help me implement a simple search filter for a Material-UI Table. Based on a searchQuery string, show only the rows where alert ID, type, message, or timestamp includes the search text. Use TypeScript."

**Result:**
Created computed `filteredAlerts` array using `.filter()` method, connected table rendering to show only matching alerts.

## 5. Preparing Video Upload to Server

**Prompt:**

"Help me enhance a video upload section in a React app (TypeScript, Material-UI). After selecting a video file, show a 'Send to Server' button. Clicking the button should (for now) console.log the file object to simulate preparing for backend upload."

**Result:**
Added Button that appears only after file is uploaded. Console.log the file on click.

## 6. Preparing Frontend API Call for Video Upload

**Prompt:**

"Help me prepare a frontend React function to upload a video file to the server. Use FormData to attach the file and POST it to a mock URL. For now, just console.log and show an alert after 'sending'. Use TypeScript."

**Result:**
Created `sendVideoToServer` function that prepares FormData, mocks sending to server, and shows success alert.

## 8. Fetching Real Alerts from Backend

**Prompt:**

"Help me update my React MainPage component to fetch alert data dynamically from a backend GET /alerts route using axios. Render the fetched alerts in a Material-UI Table."

**Result:**
Replaced dummy alerts with dynamic fetching via axios and displayed real alerts in the table.

## 9. Refreshing Alerts After Video Upload

**Prompt:**

"Help me update the React frontend to re-fetch and refresh the alert list after successfully uploading a video."

**Result:**
Moved `fetchAlerts` outside `useEffect` and manually called it after video upload.

## 10. Setting Up Basic CI with GitHub Actions

**Prompt:**

"Help me set up a GitHub Actions workflow to install dependencies, build the frontend, and run tests for both frontend and backend on every push or pull request."

**Result:**
Created `.github/workflows/ci.yml` to automate build and testing processes for the project.

## 11. Allow CI to Pass Without Frontend Tests Initially

**Prompt:**

"Help me update my GitHub Actions CI workflow so that even if no frontend tests exist, the build should still pass successfully."

**Result:**
Updated the `ci.yml` workflow to add `--passWithNoTests` to the frontend test command, allowing the CI to pass even when no tests are present.

---

## 12. Set Up Basic Frontend Test for MainPage

**Prompt:**

"Help me create a simple unit test for my React MainPage component to ensure it renders without crashing, and test if 'Search Criteria' text appears."

**Result:**
Created `MainPage.test.tsx` using React Testing Library and Jest. The test renders `MainPage` and asserts that the 'Search Criteria' heading is visible.

---

## 13. Mock Axios to Prevent Real API Calls During Testing

**Prompt:**

"Help me correctly mock axios in my React unit tests to prevent real HTTP requests and avoid ESM import errors during frontend testing."

**Result:**
Mocked axios with `jest.mock('axios')` in `MainPage.test.tsx` and ensured that `axios.get` returns a dummy `{ data: [] }` object, preventing real network calls and fixing module parsing errors.

---

## 14. Fix Frontend Test Timing and Mocking Issue

**Prompt:**

"Help me fix the timing issues in my frontend unit tests where useEffect was trying to call axios.get before the mock was properly set up."

**Result:**
Moved axios mocking into a `beforeEach()` block and used `findByText` instead of `getByText` in the test to properly wait for asynchronous rendering.

## 15. Implement Image Preprocessing for YOLOv8 Inference

**Prompt:**

"Help me preprocess an ImageData object in React to prepare it for YOLOv8 ONNX inference using onnxruntime-web. It should:
- Normalize pixel values from 0–255 to 0–1
- Rearrange channels from HWC (Height, Width, Channel) to CHW (Channel, Height, Width)
- Create a Float32Array compatible with ONNX Runtime expectations."

**Result:**
- Created `preprocessImageData` function that:
  - Takes ImageData input (640x640)
  - Normalizes pixel values to [0, 1] range
  - Rearranges pixel layout to CHW format
  - Returns a Float32Array ready for YOLO model input
- Verified correctness by manually testing dummy red image frames.

## 16. Implement YOLOv8 Model Output Postprocessing

**Prompt:**

"Help me implement a postprocessing function for YOLOv8 ONNX model output in the browser. The model output is a tensor of shape [1, 84, 8400] with:
- 4 box coordinates (center_x, center_y, width, height)
- 80 class confidence scores
Parse this tensor into usable bounding boxes, class IDs, and confidence scores, filtering out low-confidence detections."

**Result:**
- Created `postprocessOutput` function:
  - Loops over 8400 candidate boxes
  - Picks the best class with highest confidence
  - Converts normalized coordinates to pixel positions
  - Filters detections based on a score threshold (default 0.5)
- Returns an array of detections including `[x_min, y_min, width, height]`, `score`, and `classId`.

## 17. Implement Video Frame Extraction for YOLO Inference

**Prompt:**

"Help me create a function in React that extracts frames from an uploaded video file for object detection. It should:
- Play the video in a hidden HTML5 video element
- Draw frames into a canvas
- Capture an ImageData every N milliseconds
- Return a list of frames for running YOLO inference."

**Result:**
- Created `extractFramesFromVideo` function:
  - Loads a video into a hidden `<video>` element
  - Draws each frame onto a hidden `<canvas>`
  - Extracts frames as `ImageData` objects at configurable intervals
  - Returns an array of frames ready for YOLO processing

## 18. Capture and Upload Frames for Alert Creation

**Prompt:**

"Help me create a utility function in React that captures a Canvas frame as a Blob image (PNG), and upload it to my backend server for storage."

**Result:**
- Created `captureFrameAsBlob(canvas)` to convert a Canvas frame into a Blob.
- Created `uploadFrame(blob, filename)` to POST the Blob to the backend `/upload_frame` endpoint.
- Frames are saved as image files on the backend server, and their URLs are returned for use in alerts.

## 19. Create Alerts from YOLO Detections

**Prompt:**

"Help me create a React utility function that takes a YOLO detection result, attaches the saved frame URL, and POSTs an alert JSON object to the backend /alerts endpoint."

**Result:**
- Created `createAlertFromDetection(detection, frameUrl)` function.
- Constructs an alert with timestamp, detected type (class name), confidence message, and frame URL.
- Sends the alert to the backend using Axios POST request.

## 20. Integrate Full Frame-to-Alert Flow

**Prompt:**

"Help me integrate a full workflow in my React frontend: 
- Extract frames from uploaded video
- Run YOLOv8 detections
- Capture frames with Canvas
- Upload frames to backend
- Create alerts based on detections and uploaded frame URLs."

**Result:**
- Updated `handleUploadedVideo` function:
  - Extracts frames every second
  - Runs YOLO detections
  - Captures frame images and uploads to backend
  - Creates and posts alerts to backend `/alerts` endpoint
- Fully automated end-to-end alert creation after video upload.

## 21. Refactor MainPage for Local Video Detection Only

**Prompt:**

"Help me refactor my React frontend MainPage.tsx to remove the full video upload to backend. 
Only allow uploading a video to browser, extracting frames, running YOLO detection, uploading frames, and creating alerts."

**Result:**
- Deleted `sendVideoToServer` function and button.
- Updated `handleUpload` to directly run frame extraction and alert creation.
- Refreshed alerts after processing video.
- Simplified UI to only focus on in-browser detection flow.


## 22. Optimize Frame Processing Speed for YOLO Detection

**Prompt:**

"My frame extraction and YOLO detection were taking too long. Help me optimize the browser-side video processing to make detection and alert creation faster."

**Result:**
- Reduced frame processing delay from 1 second to 0.1 seconds between frames
- Added optional logic to skip every 2nd frame (process only even-indexed frames)
- Greatly improved total processing speed (~4x–5x faster)
- Pipeline remains stable, alerts are still generated properly

## 23. Add Manual Page Jump for Pagination

**Prompt:**

"I want to allow users to input a page number and directly jump to that page when browsing the alert list. Help me add a TextField input and Go button for manual page navigation."

**Result:**
- Added `pageInput` state to track user input
- Added a `<TextField>` and a `<Button>` next to Previous/Next buttons
- Clicking Go checks input validity and updates `currentPage`
- User can now quickly jump to any page directly

## 24. Add Clear All Button in Frontend to Trigger Backend Reset

**Prompt:**

"I want to add a Clear All button in my frontend MainPage. When clicked, it should send a POST request to the backend /clear_all endpoint, and refresh the alert table after clearing."

**Result:**
- Added `Clear All Alerts and Frames` button
- Confirmed user action with a popup (`window.confirm`)
- Called backend POST `/clear_all` to perform full reset
- Refreshed alert table after successful clearing

## 25. Display Supporting Frame Image in Alert Detail Dialog

**Prompt:**

"I want users to see the frame image associated with each alert when they open the AlertDetailDialog. Help me display the uploaded supporting frame image properly inside the dialog."

**Result:**
- Passed `frameUrl` into `AlertDetailDialog`
- Built full absolute URL to the backend server (`http://3.145.95.9:5000/frames/xxx.png`)
- Rendered the frame image using an `<img>` tag inside the dialog
- Ensured images load correctly and are styled to fit the dialog

## 26. Implement Search and Reset Functionality for Alert List

**Prompt:**

"I want to add full search functionality to my alert list. I need two buttons: one for searching alerts by type, one for searching by message. If the input is empty, the search should reset to show all alerts. I also want a Reset button to clear the search and reload all alerts."

**Result:**
- Added `Search by Type` button to filter alerts based on the `type` field
- Added `Search by Message` button to filter alerts based on the `message` field
- Added a `Reset` button to clear the search input and reload the full alert list
- Search and reset operations reset pagination back to page 1
- Pagination (100 alerts per page) still works after search and reset

## 27. Speed Up YOLO Frame Processing with Parallelization

**Prompt:**

"My video-to-alert process is too slow. Help me make it faster by processing multiple frames in parallel using Promise.all and batching to avoid memory overload."

**Result:**

Refactored processVideo() to generate an array of async detection tasks

Used Promise.all() to run each batch (size 5) of detection tasks concurrently

Maintained alert creation, frame capture, and upload logic

Achieved significantly faster processing for longer videos with large frame counts

Logic still skips every 2nd frame for balance between speed and accuracy

## 28. Fix Exaggerated YOLO Confidence in Alerts

**Prompt:**

"My alert messages show absurd confidence values like 'Detected a handbag with 39938.1% confidence'. Help me debug why this happens and fix it."

**Problem:**

- Alert messages included detection scores like `39938.1%`, far beyond the expected 0–100% range.
- The frontend `createAlertFromDetection()` correctly formatted confidence as `(score * 100).toFixed(1)%`, assuming `score` was between 0 and 1.
- However, the actual `score` values came from the YOLO ONNX model’s raw logits.

**Diagnosis (LLM-aided):**

- The raw model outputs contain **logits**, not probabilities.
- The `postprocessOutput()` function directly used the **maximum raw class score** without applying softmax.
- These raw scores can be >>1, causing percentage inflation.

**Fix:**

- Applied a **softmax transformation** to the class logits to convert them to normalized probabilities.
- Replaced direct `Math.max(logit)` usage with softmax-based class probability and filtered detections using this value.

**Result:**

- Alert confidence values are now human-readable and correct (e.g., `99.7%`).
- Downstream UI no longer displays misleading or mathematically invalid confidence messages.
