# Testing Strategy

CarbonWise AI employs a rigorous testing suite designed to maintain high code quality and prevent regressions in mathematical calculations and UI state management.

## 1. Testing Framework
We use **Vitest** combined with `@testing-library/react`. Vitest was chosen for its native ES module support, speed, and seamless integration with Vite/Next.js toolchains.

## 2. Coverage Requirements
All core business logic and state managers must exceed the following threshold parameters enforced via `@vitest/coverage-v8`:
- **Statements**: >85%
- **Functions**: >85%
- **Branches**: >70%
- **Lines**: >85%

## 3. Test Categories
### A. Pure Logic Tests (`src/lib/carbon/__tests__/*`)
- **Scope**: Mathematical environmental calculations (`benchmarks.ts`, `equivalents.ts`, `community.ts`, `futureTwin.ts`).
- **Strategy**: 
  - Test boundary conditions (e.g., maximum integer limits).
  - Test zero and negative inputs (ensure values clamp to 0 instead of propagating negative carbon footprints).
  - Verify deterministic logic without mocking.

### B. Global Store Tests (`src/lib/__tests__/store.test.ts`)
- **Scope**: Zustand implementation.
- **Strategy**:
  - Reset the store `beforeEach()` to avoid state bleed.
  - Verify initial states.
  - Test Zod validation rejection by injecting malformed payloads into `addAssessment`.

### C. API Route Tests (`src/app/api/__tests__/*`)
- **Scope**: Rate Limiters and Zod sanitation logic.
- **Strategy**:
  - Mock the Gemini `GoogleGenerativeAI` instance to prevent active billing hits during CI runs.
  - Trigger rapid consecutive requests to assert rate limiter rejection (429 status).

## 4. Running the Suite

**Execute all tests in watch mode:**
```bash
npm run test
```

**Generate full coverage reports (HTML & Console):**
```bash
npm run test:coverage
```
