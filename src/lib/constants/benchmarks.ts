export const AVERAGE_INDIAN = 1900;
export const AVERAGE_GLOBAL = 4700;
export const SUSTAINABLE_TARGET = 1500;
export const NET_ZERO_TARGET = 1000;

export const TIERS = [
  {
    name: "Climate Champion",
    min: 0,
    max: 1500,
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    description: "You are leading the way towards a net-zero future!"
  },
  {
    name: "Eco Leader",
    min: 1501,
    max: 2500,
    color: "bg-green-500",
    textColor: "text-green-600",
    description: "Excellent work! You are making highly sustainable choices."
  },
  {
    name: "Green Learner",
    min: 2501,
    max: 4000,
    color: "bg-yellow-500",
    textColor: "text-yellow-600",
    description: "Good start, but there is room to improve your footprint."
  },
  {
    name: "Improvement Needed",
    min: 4001,
    max: Infinity,
    color: "bg-red-500",
    textColor: "text-red-600",
    description: "Your footprint is high. Focus on major reductions."
  }
];
