# TalentPrompt (AI Interview Question Generator)

A clean, production-ready full-stack web application that leverages the Gemini API to instantly generate thoughtful, role-specific interview questions. Built as part of the Technical Co-Founder / Founding Engineer assessment.

Live Demo: [Insert Live URL Here]  
Walkthrough Video: [Insert Loom Link Here]

---

## 🚀 Key Features & UX Implementations

*   **Secure Architecture:** Implements a secure Express backend proxy to communicate with the Gemini API, ensuring sensitive API keys are never exposed to the client browser network tab.
*   **Shimmer Skeleton Loader:** Provides premium visual feedback to the user via CSS animations (`animate-pulse`) while the AI API fetches data.
*   **Defensive UI States:** 
    *   Features a friendly dashed empty state on initial boot to guide the user.
    *   Disables the input field and submit action during loading transitions to prevent accidental double-submissions.
    *   Includes a responsive "Clear" button inside the text input for seamless micro-interactions.
*   **Result Isolation:** Uses a state buffer (`searchedTitle`) to lock the results header to the exactly queried title, even if a user edits or clears the input box while reading existing questions.

---

## 🛠️ Tech Stack

*   **Frontend:** React (Vite), Tailwind CSS
*   **Backend:** Node.js, Express, @google/genai SDK
*   **AI Model:** `gemini-2.5-flash` (Optimized for ultra-low latency text generation)

---

## ⚙️ Setup & Installation

### Prerequisite
Ensure you have a Gemini API key. You can get one for free at [ai.google.dev](https://ai.google.dev).

### 1. Clone the repository
```bash
git clone [https://github.com/Jarabi/talentprompt.git](https://github.com/Jarabi/talentprompt.git)
cd YOUR_REPO_NAME