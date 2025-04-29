# Test Prompts - Automated Anomaly Detection System

This document contains a series of prompts and their corresponding results related to setting up and testing an Automated Anomaly Detection System. The prompts cover various aspects of the system, including unit testing.

---

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
