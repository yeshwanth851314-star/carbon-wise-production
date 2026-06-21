# CarbonWise AI

CarbonWise AI is a modern, personalized climate impact platform. It leverages advanced predictive models and local-first architecture to provide users with a "Sustainability Twin"—a forecast of their future environmental trajectory—and interactive tools to simulate the cumulative impact of their lifestyle choices.

## Features
- **AI Sustainability Twin**: Projects future carbon footprints dynamically based on user behavior and choices.
- **Collective Climate Impact Engine**: Simulates the large-scale effects of community-wide adoption of sustainable actions.
- **Local-First Architecture**: Prioritizes privacy by storing all personal assessments locally using Zustand + `localStorage`.
- **Interactive Simulator**: Adjust sliders to see real-time impact changes, utilizing Google Gemini for intelligent insights.
- **Comprehensive Benchmarking**: Compare your footprint against national and global averages.

## Architecture
CarbonWise AI is built on a modern stack emphasizing strict type safety and high performance:
- **Framework**: Next.js 14+ (App Router)
- **UI**: React, Tailwind CSS, Shadcn UI
- **Testing**: Vitest with `@vitest/coverage-v8` (Strict >85% logic coverage)
- **State**: Zustand
- **AI Integration**: Google Gemini 1.5 Flash via proxy
- **Validation**: Zod schema validation for all endpoints

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Environment Setup**: Create a `.env.local` file and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
4. **Run the development server**: `npm run dev`

## Testing & Quality

We maintain rigorous testing and code quality standards:

```bash
# Run strict TypeScript checks
npm run test:typecheck

# Run unit tests
npm run test

# Generate coverage reports
npm run test:coverage

# Linting
npm run lint
```

## Documentation

- **Architecture**: `docs/ARCHITECTURE.md` - In-depth breakdown of the directory structure and local-first paradigms.
- **Security**: `docs/SECURITY.md` - Details on Zod boundaries, rate-limiting, and error handling.
- **Testing**: `docs/TESTING.md` - Guidelines and requirements for the testing suite.

## License
MIT License
