import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store';

describe('Global Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useStore.getState().resetData();
  });

  it('initializes with default values', () => {
    const state = useStore.getState();
    expect(state.level).toBe(1);
    expect(state.xp).toBe(0);
    expect(state.assessments.length).toBe(0);
    expect(state.unlockedAchievements.length).toBe(0);
  });

  it('adds an assessment and calculates initial recommendations', () => {
    const store = useStore.getState();
    store.addAssessment({
      transportScore: 50,
      energyScore: 20,
      foodScore: 10,
      shoppingScore: 5,
      wasteScore: 5,
      totalEmissions: 90,
      sustainabilityScore: 75
    });

    const updatedState = useStore.getState();
    expect(updatedState.assessments.length).toBe(1);
    expect(updatedState.assessments[0].transportScore).toBe(50);
    
    // Transport score > 30 triggers a recommendation
    expect(updatedState.recommendations.length).toBeGreaterThan(0);
    expect(updatedState.recommendations[0].recommendation).toContain('public transit');
  });

  it('throws ValidationError for invalid assessment data', () => {
    const store = useStore.getState();
    expect(() => {
      store.addAssessment({
        transportScore: -50, // Invalid: should be positive
        energyScore: 20,
        foodScore: 10,
        shoppingScore: 5,
        wasteScore: 5,
        totalEmissions: -10,
        sustainabilityScore: 75
      });
    }).toThrow();
  });

  it('adds daily log and awards XP', () => {
    const store = useStore.getState();
    const initialXp = store.xp;
    
    store.addDailyLog({
      walkingKm: 5,
      cyclingKm: 2,
      publicTransportKm: 10,
      plasticSaved: 3,
      carbonSaved: 2.5
    });

    const updatedState = useStore.getState();
    expect(updatedState.dailyLogs.length).toBe(1);
    expect(updatedState.xp).toBe(initialXp + 20); // 20 XP awarded for daily log
  });

  it('completes challenges, awards XP, and levels up', () => {
    const store = useStore.getState();
    const challengeId = store.userChallenges[0].challenge.id;
    const rewardPoints = store.userChallenges[0].challenge.rewardPoints;

    store.completeChallenge(challengeId);

    const updatedState = useStore.getState();
    expect(updatedState.userChallenges[0].completed).toBe(true);
    expect(updatedState.xp).toBe(rewardPoints);
    
    // Test leveling up: 1000 XP per level
    useStore.getState().addXp(1000);
    expect(useStore.getState().level).toBe(2);
  });

  it('unlocks achievements uniquely', () => {
    const store = useStore.getState();
    store.unlockAchievement('Eco Beginner');
    store.unlockAchievement('Eco Beginner'); // Should not duplicate

    const updatedState = useStore.getState();
    expect(updatedState.unlockedAchievements.length).toBe(1);
    expect(updatedState.unlockedAchievements[0]).toBe('Eco Beginner');
  });

  it('toggles action plan tasks', () => {
    const store = useStore.getState();
    store.setActionPlan([
      { day: 1, task: 'Test Task', completed: false }
    ]);

    useStore.getState().toggleActionPlanTask(1);

    const updatedState = useStore.getState();
    expect(updatedState.actionPlanTasks[0].completed).toBe(true);
  });
});
