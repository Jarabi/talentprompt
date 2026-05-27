# TalentPrompt (AI Interview Question Generator)

A secure, decoupled full-stack web application that leverages generative AI to instantly create three contextual, role-specific interview questions based on a user's target job title. Engineered with a production-minded architecture as part of a Technical Founding Engineer evaluation.

*   **Live Frontend (Vite/Vercel):** [Talent Prompt](https://talentprompt.vercel.app/)
<!-- *   **Live Backend Proxy (Node/Render):** [Insert Live Render URL Here]
*   **Video Walkthrough:** [Insert Loom Walkthrough Link Here] -->

---

## 🏗️ System Architecture & Directory Layout

The codebase utilizes a structured **monorepo layout** separating the user-facing client environment from sensitive upstream server integrations.

```text
├── client/                 # Frontend client workspace (Vercel)
│   ├── public/
│   ├── src/
│   │   ├── components/     # High-energy, defensive UI components
│   │   └── utils/api.js    # Clean API network service layer
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .env                    # Secure local environment variables
├── .gitignore
├── package.json            # Node/Express root configurations (Render)
├── README.md
└── server.js               # Dedicated backend proxy & security gateway
```

---
## 🚀 Architectural & Engineering Highlights

- **Secure API Key Encapsulation (SoC)**: Implements a dedicated Node/Express proxy layer. The React frontend never imports the upstream AI SDK or exposes sensitive environment tokens (`GEMINI_API_KEY`) to the browser client's network inspection tab.

- **Production Token Security (IP Throttling)**: Outfitted with `express-rate-limit` middleware on the AI generation endpoints. This blocks automated traffic spam, credential exploitation, and platform token depletion by forcing an IP rate cap (Max 5 requests per 10 minutes per device).

- **Decoupled Origin Lockdown (CORS)**: Cross-Origin Resource Sharing is locked explicitly to the production Vercel deployment domain. Wildcards are completely eliminated to prevent third-party malicious script execution or data scraping from unauthorized local engines.

- **Defensive UX Implementation**: Engineered with deep user-feedback interfaces:

    - **Async Skeleton States**: Uses fluid CSS-pulsing loading frames (`animate-pulse`) during async API calls to eliminate interface drop-out anxiety.

    - **Input Blocking**: Form actions and input values are temporarily frozen during active requests to prevent duplicate network payloads.

    - **Layout State Buffering**: Utilizes a `searchedTitle` layout tracking hook to keep the question module header firmly bound to the evaluated result, preserving UI textual alignment even if a user edits or clears the text field while reading.

---

## 🛠️ Tech Stack

- **Frontend UI**: React (Functional Hooks + Context), Tailwind CSS, Vite Bundle Compiler

- **Backend Middleware**: Node.js, Express Router, Cors, Express-Rate-Limit

- **Generative Engine**: Official Google GenAI SDK (@google/genai)

- **Core AI Inference Model**: gemini-2.5-flash (Optimized for ultra-low latency structured array returns)

---

## ⚙️ Local Development Configuration

Prerequisites

- Node.js version 20 or later installed locally.

- An active Gemini API Key from Google AI Studio.

### 1. Repository Setup & Dependencies

Clone the repository and install dependencies for both individual scopes:

```bash
git clone https://github.com/Jarabi/talentprompt.git
cd talentprompt

# Install core backend engine packages
npm install

# Install client UI packages
cd client && npm install
```

### 2. Upstream Authentication Environment

Create an `.env` file in the project's root directory:

```
PORT=3001
GEMINI_API_KEY=your_actual_gemini_api_key_string
FRONTEND_URL=http://localhost:5173
```

### 3. Execution Engines

To run the server instance locally (from the project root directory):

```bash
node server.js
```

In a separate terminal workspace, spin up the local client compiler:

```bash
cd client
npm run dev
```

Open `http://localhost:5173` to test the integrated data pipeline.

---
## 📝 Infrastructure & Production Engineering Review

**The Trailing Slash Bug Mitigation**

During deployment execution across highly decoupled servers, modern browsers will trigger a `null` network status error if strict origin string matches fail. The server's allowed origins list was specifically hardened to handle string values *without* trailing slash anomalies, safely matching native browser `origin` headers perfectly while keeping data delivery seamless.

**Cold-Start Latency Management**

Because the backend runs on a serverless container instance (Render Free Tier), runtime environments spin down automatically after 15 minutes of user stagnation. The infrastructure wrapper accounts for this containerization design choice, gracefully managing initial network handshakes and payload timeouts while optimizing response integrity.