# Security Architecture

This document outlines the security architecture, validation strategies, and error handling philosophies implemented in **CarbonWise AI**.

## 1. Zod Validation
We employ strict, schema-driven runtime validation using **Zod** across all external inputs.

### Protected Boundaries
- **Assessment Inputs**: The `assessmentSchema` (`src/lib/validation/assessment.ts`) strictly types all carbon footprint metrics (transport, energy, food, etc.).
- **Simulator Payloads**: The `simulateInsightsSchema` (`src/lib/validation/simulator.ts`) sanitizes dynamic arrays of user choices before passing them to the AI coach.
- **Global Store Mutators**: All writes to the `zustand` global store are validated through their respective Zod parsers to prevent corrupted local state from breaking the application.

## 2. Rate Limiting
To prevent abuse of our server-side API routes (specifically the Gemini integration), we have implemented a rudimentary in-memory IP-based rate limiter in `src/app/api/simulate-insights/route.ts`.
- **Window**: 60 seconds
- **Limit**: 5 requests per IP per window

*(Note: In a true multi-server production environment, this should be migrated to Redis or Vercel KV.)*

## 3. Server-side Gemini Integration
We never expose the `GEMINI_API_KEY` on the client side. All generative AI requests are proxied through a secure Next.js App Router API endpoint (`/api/simulate-insights`).
- The client sends a sanitized payload.
- The server validates the payload with Zod.
- The server communicates with the Gemini model.
- The server structures the JSON response and returns it to the client.

## 4. Local-first Storage Architecture
CarbonWise AI is explicitly designed as a local-first application. We do not store personalized carbon footprint data on centralized databases.
- All assessments, simulation results, and gamification progress are stored locally using `localStorage` via Zustand persist middleware.
- This provides an immediate privacy guarantee: User data never leaves their device unless explicitly requested by the user (e.g., when querying the Gemini API).

## 5. Error Handling Strategy
We have centralized our error instantiations in `src/lib/errors.ts`. This prevents raw stack traces from leaking to the client interface.
- `ApplicationError`: Base class for operational errors.
- `ValidationError`: Specifically handles Zod parsing rejections and returns formatted `.issues`.
- `ApiError`: Maps HTTP status codes to logical application failures.

All error throwing within standard libraries should use these explicitly defined error classes to guarantee predictable capture and presentation.
