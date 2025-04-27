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

## 13. Mock
