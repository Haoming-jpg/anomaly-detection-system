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
