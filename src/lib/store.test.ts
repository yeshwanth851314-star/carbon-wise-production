import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStore } from './store';

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-1234'
});

describe('Zustand Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.setState({
      assessments: [],
      dailyLogs: [],
      actionPlanTasks: [],
      userChallenges: [],
      level: 1,
      xp: 0,
      unlockedAchievements: [],
      simulationResult: null,
    });
  });

  it('should save assessment and initialize defaults', () => {
    const assessmentData = {
      transportScore: 1000,
      energyScore: 1000,
      foodScore: 1000,
      shoppingScore: 1000,
      wasteScore: 1000,
      totalEmissions: 5000,
      sustainabilityScore: 50,
      recommendations: []
    };

    useStore.getState().addAssessment(assessmentData);
    
    const state = useStore.getState();
    expect(state.assessments).toHaveLength(1);
    expect(state.assessments[0].totalEmissions).toBe(5000);
    expect(state.xp).toBe(100); // Initial assessment gives 100 XP
  });

  it('should add daily log and update xp', () => {
    useStore.getState().addDailyLog({
      walkingKm: 5,
      cyclingKm: 0,
      publicTransportKm: 0,
      plasticSaved: 2,
      carbonSaved: 1.5
    });

    const state = useStore.getState();
    expect(state.dailyLogs).toHaveLength(1);
    expect(state.dailyLogs[0].walkingKm).toBe(5);
    expect(state.xp).toBe(20); // Logging gives 20 XP
  });

  it('should level up when crossing 1000 XP', () => {
    // Manually set XP to 990
    useStore.setState({ xp: 990, level: 1 });
    
    useStore.getState().addDailyLog({ 
      walkingKm: 0,
      cyclingKm: 0,
      publicTransportKm: 0,
      plasticSaved: 0,
      carbonSaved: 1 
    }); // +20 XP -> 1010 XP
    
    const state = useStore.getState();
    expect(state.xp).toBe(1010);
    expect(state.level).toBe(2);
  });

  it('should handle action plan tasks correctly', () => {
    const plan = [
      { day: 1, task: "Do this", completed: false },
      { day: 2, task: "Do that", completed: false }
    ];

    useStore.getState().setActionPlan(plan);
    expect(useStore.getState().actionPlanTasks).toHaveLength(2);

    useStore.getState().toggleActionPlanTask(1);
    expect(useStore.getState().actionPlanTasks[0].completed).toBe(true);
    expect(useStore.getState().xp).toBe(0); // This action doesn't grant XP in current logic
  });
});
