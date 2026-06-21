# Architecture Overview: CarbonWise AI

CarbonWise AI is a modern, responsive web application engineered using a **Local-First**, serverless Next.js App Router architecture. This document outlines the structural and architectural paradigms enforced within the repository.

## 1. Core Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **UI & Components**: React, Tailwind CSS, Shadcn UI (Radix Primitives)
- **State Management**: Zustand (with LocalStorage persistence)
- **Data Visualization**: Recharts, html2canvas/jsPDF
- **AI Integration**: Google Gemini 1.5 Flash
- **Testing**: Vitest (Istanbul/V8 Coverage)

## 2. Directory Structure

```text
src/
├── app/                  # Next.js App Router endpoints & pages
│   ├── api/              # Secure server-side routes (Gemini proxy)
│   ├── dashboard/        # Authenticated/Local state user views
│   ├── simulator/        # AI interactive components
│   └── globals.css       # Tailwind entry point
├── components/           # Reusable UI React Components
│   └── ui/               # Generic Shadcn components (buttons, sliders, etc.)
└── lib/                  # Business Logic & Core Libraries
    ├── carbon/           # Deterministic environmental engines (benchmarks, math)
    ├── validation/       # Zod schemas for external boundaries
    ├── store.ts          # Zustand global state definition
    ├── errors.ts         # Centralized error classes
    └── logger.ts         # Console-safe JSON log wrapper
```

## 3. Thin UI / Thick Library Principle
We strictly adhere to separating business logic from view layers.
- **`src/components`**: Handles only rendering, React hooks, and animations.
- **`src/lib/carbon`**: Pure TypeScript functions. They receive numeric inputs and return deterministic calculations (e.g., `calculateBenchmarkComparison()`). This ensures the logic is highly testable without mocking the DOM.

## 4. Local-First Data Flow
To maximize privacy and minimize latency, user data is strictly stored on the client.
1. The user inputs their lifestyle data (transport, diet).
2. The UI dispatches an action to `useStore` (Zustand).
3. The store performs Zod validation on the payload.
4. If valid, the data is pushed to the local array and synced to `localStorage`.
5. Features like the **AI Simulator** proxy only temporary, anonymized metrics to the backend `/api/simulate-insights` route, avoiding persistent database usage.

## 5. Security & Error Handling
Refer to `docs/SECURITY.md` for a comprehensive breakdown of our Zod boundaries, API rate limiting, and exception mapping.
