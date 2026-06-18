import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SustainabilityReportGenerator } from '../SustainabilityReport';
import { useStore } from '@/lib/store';

// Mock html2pdf
vi.mock('html2pdf.js', () => {
  return {
    default: () => ({
      from: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      save: vi.fn().mockResolvedValue(true)
    })
  };
});

describe('SustainabilityReport Component', () => {
  beforeEach(() => {
    useStore.setState({
      assessments: [
        {
          id: 'test-1',
          transportScore: 100,
          energyScore: 100,
          foodScore: 100,
          shoppingScore: 100,
          wasteScore: 100,
          totalEmissions: 500,
          sustainabilityScore: 85,
          createdAt: new Date().toISOString()
        }
      ],
      simulationResult: {
        projectedFootprint: 400,
        reductionAmount: 100,
        reductionPercentage: 20,
        biggestImpactAction: 'Reduce Car Usage'
      },
      level: 4,
      xp: 420,
      unlockedAchievements: ["Eco Planner", "Future Saver"],
      userChallenges: [
        { id: 'c1', progress: 5, completed: true, challenge: { id: 'c1', title: 'Walk', description: '', carbonTarget: 5, rewardPoints: 10 } },
        { id: 'c2', progress: 0, completed: false, challenge: { id: 'c2', title: 'Bike', description: '', carbonTarget: 5, rewardPoints: 10 } }
      ]
    });
  });

  it('renders correctly with store data', () => {
    render(<SustainabilityReportGenerator />);
    
    // Check main headings
    expect(screen.getByText('Sustainability Impact Report')).toBeInTheDocument();
    
    // Check footprint values
    expect(screen.getAllByText(/500/)[0]).toBeInTheDocument(); // Current
    expect(screen.getAllByText(/400/)[0]).toBeInTheDocument(); // Projected
    
    // Check gamification
    expect(screen.getByText('Level 4')).toBeInTheDocument();
    expect(screen.getByText('420 XP')).toBeInTheDocument();
    
    // Check achievements
    expect(screen.getByText('Eco Planner')).toBeInTheDocument();
    expect(screen.getByText('Future Saver')).toBeInTheDocument();
    
    // Check completed challenges (only 1 completed in store setup)
    expect(screen.getByText('1 / 2')).toBeInTheDocument(); 
  });

  it('renders nothing if no assessment exists', () => {
    useStore.setState({ assessments: [] });
    const { container } = render(<SustainabilityReportGenerator />);
    expect(container.firstChild).toBeNull();
  });
});
