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
