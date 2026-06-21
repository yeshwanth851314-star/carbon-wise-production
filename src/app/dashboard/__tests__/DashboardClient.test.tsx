import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardClient from '../DashboardClient';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('DashboardClient Component', () => {
  const mockAssessment = {
    transportScore: 100,
    energyScore: 100,
    foodScore: 100,
    shoppingScore: 100,
    wasteScore: 100,
    totalEmissions: 500,
    sustainabilityScore: 85,
  };

  const mockHistorical = [
    { createdAt: new Date().toISOString(), totalEmissions: 500, sustainabilityScore: 85 }
  ];

  const mockMetrics = {
    totalCarbonSaved: 15,
    treesEquivalent: 2,
    waterSaved: 50
  };

  const mockUser = {
    level: 2,
    xp: 250,
    dailyLogs: [{ walkingKm: 2, plasticSaved: 1 }],
    userChallenges: []
  };

  it('renders dashboard overview correctly', () => {
    render(
      <DashboardClient 
        assessment={mockAssessment}
        historicalAssessments={mockHistorical}
        recommendations={[{ id: 'r1', recommendation: 'Do this', estimatedSavings: 10 }]}
        metrics={mockMetrics}
        user={mockUser}
      />
    );
    
    // Check if score is rendered
    expect(screen.getAllByText('85').length).toBeGreaterThan(0);

    // Check if emissions are rendered
    expect(screen.getAllByText('500').length).toBeGreaterThan(0);
    
    // Check if recommendation is rendered
    expect(screen.getByText('Do this')).toBeInTheDocument();
  });
});
