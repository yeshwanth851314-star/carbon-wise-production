import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { assessmentSchema } from './validation/assessment'
import { ValidationError } from './errors'

export interface Assessment {
  id: string
  transportScore: number
  energyScore: number
  foodScore: number
  shoppingScore: number
  wasteScore: number
  totalEmissions: number
  sustainabilityScore: number
  createdAt: string
}

export interface DailyLog {
  id: string
  date: string
  walkingKm: number
  cyclingKm: number
  publicTransportKm: number
  plasticSaved: number
  carbonSaved: number
}

export interface Recommendation {
  id: string
  recommendation: string
  estimatedSavings: number
  status: boolean
  createdAt: string
}

export interface UserChallenge {
  id: string
  challenge: {
    id: string
    title: string
    description: string
    carbonTarget: number
    rewardPoints: number
  }
  progress: number
  completed: boolean
}

/**
 * Global application state definition encompassing all user metrics, history, and gamification progress.
 */
export interface UserState {
  level: number
  xp: number
  assessments: Assessment[]
  dailyLogs: DailyLog[]
  recommendations: Recommendation[]
  userChallenges: UserChallenge[]
  unlockedAchievements: string[]
  actionPlanTasks: { day: number; task: string; completed: boolean }[]
  simulationResult: {
    projectedFootprint: number;
    reductionAmount: number;
    reductionPercentage: number;
    biggestImpactAction: string | null;
  } | null;
  
  // Actions
  addAssessment: (assessment: Omit<Assessment, 'id' | 'createdAt'>) => void
  addDailyLog: (log: Omit<DailyLog, 'id' | 'date'>) => void
  completeChallenge: (challengeId: string) => void
  addXp: (amount: number) => void
  unlockAchievement: (name: string) => void
  setActionPlan: (tasks: { day: number; task: string; completed: boolean }[]) => void
  setSimulationResult: (result: {
    projectedFootprint: number;
    reductionAmount: number;
    reductionPercentage: number;
    biggestImpactAction: string | null;
  }) => void
  toggleActionPlanTask: (day: number) => void
  resetData: () => void
}

const initialChallenges = [
  {
    id: '1',
    challenge: {
      id: 'c1',
      title: 'Meatless Monday',
      description: 'Skip meat for one day to reduce agricultural emissions',
      carbonTarget: 5.2,
      rewardPoints: 50
    },
    progress: 0,
    completed: false
  },
  {
    id: '2',
    challenge: {
      id: 'c2',
      title: 'Public Transport Commute',
      description: 'Use public transport instead of driving to work',
      carbonTarget: 4.8,
      rewardPoints: 40
    },
    progress: 0,
    completed: false
  }
]

/**
 * Global Zustand store preserving user application state persistently using localStorage.
 */
export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      level: 1,
      xp: 0,
      assessments: [],
      dailyLogs: [],
      recommendations: [],
      userChallenges: initialChallenges,
      unlockedAchievements: [],
      actionPlanTasks: [],
      simulationResult: null,

      /**
       * Adds a new carbon footprint assessment to the user's history and triggers relevant recommendations.
       */
      addAssessment: (assessmentData) => {
        const newAssessmentRaw = {
          ...assessmentData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString()
        }

        // Zod Validation
        const parsed = assessmentSchema.safeParse(newAssessmentRaw);

        if (!parsed.success) {
          throw new ValidationError("Invalid assessment payload", parsed.error.issues);
        }

        const newAssessment = parsed.data;
        
        // Generate basic recommendations based on scores
        const newRecommendations: Recommendation[] = []
        if (assessmentData.transportScore > 30) {
          newRecommendations.push({
            id: crypto.randomUUID(),
            recommendation: 'Try using public transit or carpooling twice a week',
            estimatedSavings: 15.5,
            status: false,
            createdAt: new Date().toISOString()
          })
        }
        if (assessmentData.energyScore > 40) {
          newRecommendations.push({
            id: crypto.randomUUID(),
            recommendation: 'Switch to LED bulbs and unplug unused electronics',
            estimatedSavings: 8.2,
            status: false,
            createdAt: new Date().toISOString()
          })
        }

        set((state) => ({
          assessments: [newAssessment, ...state.assessments],
          recommendations: [...newRecommendations, ...state.recommendations]
        }))
        
        // Give 100 XP for completing assessment
        get().addXp(100)
      },

      /**
       * Submits a daily activity log containing actions like walking or cycling, calculating the carbon saved.
       */
      addDailyLog: (logData) => {
        const newLog: DailyLog = {
          ...logData,
          id: crypto.randomUUID(),
          date: new Date().toISOString()
        }
        set((state) => ({
          dailyLogs: [newLog, ...state.dailyLogs]
        }))
        
        // Give XP for tracking
        get().addXp(20)
      },

      /**
       * Marks a sustainability challenge as complete, distributing the associated reward points.
       */
      completeChallenge: (challengeId) => {
        set((state) => ({
          userChallenges: state.userChallenges.map(uc => {
            if (uc.challenge.id === challengeId && !uc.completed) {
              get().addXp(uc.challenge.rewardPoints)
              return { ...uc, completed: true, progress: uc.challenge.carbonTarget }
            }
            return uc
          })
        }))
      },

      /**
       * Incrementally adds Experience Points (XP) and calculates level-ups when thresholds are passed.
       */
      addXp: (amount) => {
        set((state) => {
          const newXp = state.xp + amount
          const newLevel = Math.floor(newXp / 1000) + 1
          return { xp: newXp, level: newLevel }
        })
      },

      /**
       * Unlocks a unique badge/achievement for the user if it has not been granted already.
       */
      unlockAchievement: (name) => {
        set((state) => {
          if (!state.unlockedAchievements.includes(name)) {
            return { unlockedAchievements: [...state.unlockedAchievements, name] }
          }
          return state
        })
      },

      /**
       * Overwrites the active 7-Day Action Plan generated by the AI coach.
       */
      setActionPlan: (tasks) => {
        set({ actionPlanTasks: tasks })
      },

      /**
       * Commits the latest simulator forecast into the global state for dashboard and twin consumption.
       */
      setSimulationResult: (result) => {
        set({ simulationResult: result })
      },

      /**
       * Toggles the completion status of an individual daily task in the AI 7-Day Action Plan.
       */
      toggleActionPlanTask: (day) => {
        set((state) => ({
          actionPlanTasks: state.actionPlanTasks.map(t => 
            t.day === day ? { ...t, completed: !t.completed } : t
          )
        }))
      },
      
      /**
       * Permanently deletes all local user data and resets the store to its initial state.
       */
      resetData: () => {
        set({
          level: 1,
          xp: 0,
          assessments: [],
          dailyLogs: [],
          recommendations: [],
          userChallenges: initialChallenges,
          unlockedAchievements: [],
          actionPlanTasks: [],
          simulationResult: null
        })
      }
    }),
    {
      name: 'carbon-wise-storage', // unique name in localStorage
    }
  )
)
