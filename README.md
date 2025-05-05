# AI Research Platform Dashboard

A dashboard designed for managing AI research workflows, focusing on model versions, training schedules, parameter settings, and result tracking.  
The platform helps researchers systematically manage experiments and streamline the entire model development cycle.

## 🚀 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database (Mocked):** Firebase Firestore
- **Real-time Progress (Mocked):** mock-socket for WebSocket simulation
- **Form Validation:** react-hook-form, zod
- **State Management:** Context + Reducer (planned migration to Zustand)
- **Hosting:** Vercel

## 🛠️ Core Features

- **Model and Version Management**
  - Manage models and track their version history
  - Create new versions with guided descriptions
  - Pre-fill recommended parameters based on training results

- **Parameter Settings**
  - Form-based parameter creation with validation
  - Auto-tuning suggested parameter tables based on metrics
  - Highlight changed fields and support one-click application

- **Training Schedule and Result Tracking**
  - Create training schedules and monitor real-time training progress
  - Track results with success/failure handling
  - Display key metrics such as accuracy and loss trends

- **Version Comparison and Evolution**
  - Compare different versions by parameters and results
  - Auto-generate insights and summary scores
  - Support creating new versions based on comparison results

- **System Architecture Highlights**
  - Modular folder structure for models, versions, schedules, parameters, and results
  - Mock API and mock WebSocket integrated for end-to-end simulation
  - Skeleton loading states, empty state guidance, and fallback error handling
  - Focused UX enhancements for research workflows

## 🧠 Future Development Strategy (v3)

- Expand Dataset Management module
- Enhance Firebase database simulation for richer testing
- Refactor state management to Zustand for scalable multi-state synchronization
- Redesign hooks and utilities with a clear separation of API layer, global store layer, and cache layer

## 📂 Project Structure
```
.
├── public/
│   └── guide/               # Images for guide cards
│
│   # （備註）原本 next.js 預設的 public 資料（如 next.svg、vercel.svg）將移除
│   # 後續首頁會重新設計新的素材
│
├── src/
│   ├── app/                  # App Router pages and routes
│   │   ├── calendar/         # Calendar related route
│   │   ├── dashboard/        # Dashboard home page
│   │   ├── debug/            # Debugging and test pages
│   │   ├── docs/             # Documentation pages (MDX supported)
│   │   ├── models/           # Model management routes
│   │   ├── schedules/        # Training schedules management routes
│   │   ├── favicon.ico
│   │   ├── layout.tsx        # Global App Router layout
│   │   └── page.tsx          # Landing page (currently a placeholder, to be redesigned)
│
│   # 🔹補充：app/ 資料夾需補上 route 說明文件（例如：docs/router-overview.md）
│
│   ├── components/
│   │   ├── common/           # Reusable basic components (e.g., InfoRow, Card wrappers)
│   │   ├── model/            # Model info display components
│   │   ├── version/          # Version detail and action components
│   │   ├── parameter/        # Parameter form and display components
│   │   ├── schedule/         # Schedule form, progress, and result components
│   │   ├── trainingResult/   # Training result visualization components
│   │   ├── compare/          # Version comparison-related components
│   │   ├── guidance/         # Guide cards, onboarding components
│   │   ├── layout/           # Layout-related shared components (e.g., containers, wrappers)
│   │   └── ui/               # UI primitives imported or customized from shadcn/ui
│
│   ├── contexts/
│   │   ├── model/
│   │   ├── version/
│   │   ├── parameter/
│   │   ├── schedule/
│   │   ├── trainingResult/
│   │   └── GlobalProvider.tsx
│
│   ├── hooks/
│   │   ├── model/
│   │   │   ├── useModelList.ts             # Fetch and manage model list
│   │   │   └── useModelById.ts             # Fetch model by ID
│   │
│   │   ├── version/
│   │   │   ├── useVersionList.ts            # Fetch version list by model ID
│   │   │   ├── useVersionById.ts            # Fetch version by ID
│   │   │   └── useAddVersion.ts             # Create new version
│   │
│   │   ├── parameter/
│   │   │   ├── useParameterByVersionKey.ts # Fetch parameters by version key
│   │   │   └── useParameterSubmit.ts       # Submit parameter settings
│   │
│   │   ├── schedule/
│   │   │   ├── useScheduleList.ts            # Fetch schedules by version key
│   │   │   ├── useScheduleById.ts            # Fetch schedule by ID
│   │   │   └── useScheduleCreate.ts          # Create new schedule
│   │
│   │   ├── trainingResult/
│   │   │   ├── useTrainingResultByScheduleId.ts   # Fetch training result by schedule ID
│   │   │   └── useTrainingResultByVersion.ts      # Fetch latest training result by version
│   │
│   │   ├── socket/
│   │   │   └── useTrainingSocket.ts          # WebSocket hook for tracking training progress
│   │
│   │   ├── useHashScroll.ts                  # Smooth scroll to anchor based on hash
│   │   ├── useLoadingGuard.ts                # Prevent premature rendering during loading
│   │   └── useNotifyToast.ts                 # Display toast notifications (success, error, info)
│
├── lib/
│   ├── action/          # Local UI actions or client-side interaction helpers
│   ├── api/             # API abstraction layer (mocked API handlers)
│   ├── mock/            # Mock server simulation (e.g., WebSocket mocks)
│   ├── utils/           # General-purpose utility functions (formatting, sorting, etc.)
│   └── utils.ts         # Utility helpers directly adapted from shadcn/ui (e.g., cn() function)
│
├── mock/                  # Mock data for models, schedules, versions, etc.
├── reducers/              # Reducer functions for context states
├── schemas/               # Zod validation schemas for forms
├── styles/                # Global styles if needed (currently minimal)
├── types/                 # TypeScript types and interfaces
│
├── .gitignore
├── .gitmessage
└── commits.txt
```
## 🌐 Live Demo

[Click here to view the demo on Vercel](#)  
(*The link will be updated after deployment.*)

---

# 📌 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/fgh64hfhk/ai-research-dashboard-v2

# Install dependencies
cd ai-research-dashboard-v2
npm install

# Run the development server
npm run dev

The app will be available at http://localhost:3000.