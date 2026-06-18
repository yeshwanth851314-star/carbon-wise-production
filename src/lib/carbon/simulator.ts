import { EMISSION_FACTORS } from '../constants/emissionFactors';

export interface SimulationInputs {
  baseEmissions: number;
  carReduction: number;
  publicTransit: number;
  bikeUsage: number;
  switchEV: boolean;
  acReduction: number;
  elecReduction: number;
  renewableEnergy: boolean;
  meatReduction: number;
  switchVeg: boolean;
  shoppingReduction: number;
  plasticReduction: number;
  recyclingIncrease: number;
  baseTrans?: number;
  baseEnergy?: number;
  baseFood?: number;
  baseShop?: number;
  baseWaste?: number;
}

export interface Impact {
  name: string;
  saving: number;
}

export interface SimulationResult {
  projectedFootprint: number;
  reductionAmount: number;
  reductionPercentage: number;
  biggestImpactAction: Impact | null;
  impactMap: Impact[];
}

export function calculateProjectedFootprint(inputs: SimulationInputs): SimulationResult {
  const {
    baseEmissions,
    carReduction,
    publicTransit,
    bikeUsage,
    switchEV,
    acReduction,
    elecReduction,
    renewableEnergy,
    meatReduction,
    switchVeg,
    shoppingReduction,
    plasticReduction,
    recyclingIncrease,
  } = inputs;

  let newTrans = inputs.baseTrans ?? (baseEmissions * 0.3);
  let newEnergy = inputs.baseEnergy ?? (baseEmissions * 0.3);
  let newFood = inputs.baseFood ?? (baseEmissions * 0.2);
  let newShop = inputs.baseShop ?? (baseEmissions * 0.1);
  let newWaste = inputs.baseWaste ?? (baseEmissions * 0.1);

  const impacts: Impact[] = [];

  // Transport Math
  const carSavings = (newTrans * EMISSION_FACTORS.TRANSPORT.CAR_WEIGHT) * (carReduction / 100);
  newTrans -= carSavings;
  if (carSavings > 0) impacts.push({ name: "Reduce Car Usage", saving: carSavings });

  const transitSavings = (newTrans * EMISSION_FACTORS.TRANSPORT.TRANSIT_WEIGHT) * (publicTransit / 100);
  newTrans -= transitSavings;
  if (transitSavings > 0) impacts.push({ name: "Public Transit", saving: transitSavings });

  const bikeSavings = (newTrans * EMISSION_FACTORS.TRANSPORT.BIKE_WEIGHT) * (bikeUsage / 100);
  newTrans -= bikeSavings;
  if (bikeSavings > 0) impacts.push({ name: "Biking/Walking", saving: bikeSavings });

  if (switchEV) {
    const evSavings = newTrans * EMISSION_FACTORS.TRANSPORT.EV_SAVINGS_MULTIPLIER;
    newTrans -= evSavings;
    impacts.push({ name: "Switch to EV", saving: evSavings });
  }

  // Energy Math
  const acSavings = (newEnergy * EMISSION_FACTORS.ENERGY.AC_WEIGHT) * (acReduction / 100);
  newEnergy -= acSavings;
  if (acSavings > 0) impacts.push({ name: "Reduce AC", saving: acSavings });

  const elecSavings = (newEnergy * EMISSION_FACTORS.ENERGY.ELEC_WEIGHT) * (elecReduction / 100);
  newEnergy -= elecSavings;
  if (elecSavings > 0) impacts.push({ name: "Reduce Electricity", saving: elecSavings });

  if (renewableEnergy) {
    const renSavings = newEnergy * EMISSION_FACTORS.ENERGY.RENEWABLE_SAVINGS_MULTIPLIER;
    newEnergy -= renSavings;
    impacts.push({ name: "Renewable Energy", saving: renSavings });
  }

  // Food Math
  const meatSavings = (newFood * EMISSION_FACTORS.FOOD.MEAT_WEIGHT) * (meatReduction / 100);
  newFood -= meatSavings;
  if (meatSavings > 0) impacts.push({ name: "Reduce Meat", saving: meatSavings });

  if (switchVeg) {
    const vegSavings = newFood * EMISSION_FACTORS.FOOD.VEG_SAVINGS_MULTIPLIER;
    newFood -= vegSavings;
    impacts.push({ name: "Vegetarian Diet", saving: vegSavings });
  }

  // Shopping Math
  const shopSavings = newShop * (shoppingReduction / 100);
  newShop -= shopSavings;
  if (shopSavings > 0) impacts.push({ name: "Reduce Shopping", saving: shopSavings });

  // Waste Math
  const plasticSavings = (newWaste * EMISSION_FACTORS.WASTE.PLASTIC_WEIGHT) * (plasticReduction / 100);
  newWaste -= plasticSavings;
  if (plasticSavings > 0) impacts.push({ name: "Reduce Plastic", saving: plasticSavings });

  const recycleSavings = (newWaste * EMISSION_FACTORS.WASTE.RECYCLE_WEIGHT) * (recyclingIncrease / 100);
  newWaste -= recycleSavings;
  if (recycleSavings > 0) impacts.push({ name: "Increase Recycling", saving: recycleSavings });

  const projected = Math.max(0, Math.round(newTrans + newEnergy + newFood + newShop + newWaste));
  const reductionAmount = baseEmissions - projected;
  const reductionPercentage = Math.round((reductionAmount / baseEmissions) * 100);

  impacts.sort((a, b) => b.saving - a.saving);
  const biggestImpactAction = impacts.length > 0 ? impacts[0] : null;

  return {
    projectedFootprint: projected,
    reductionAmount,
    reductionPercentage,
    biggestImpactAction,
    impactMap: impacts
  };
}

export function calculateForecast(projectedFootprint: number) {
  return {
    sixMonthForecast: Math.max(0, Math.round(projectedFootprint * 0.9)),
    oneYearForecast: Math.max(0, Math.round(projectedFootprint * 0.8)),
  };
}

export function calculateImpactEquivalents(reductionAmount: number) {
  return {
    treesPlanted: Math.round(reductionAmount * EMISSION_FACTORS.EQUIVALENTS.TREES_PLANTED_PER_KG),
    kmAvoided: Math.round(reductionAmount * EMISSION_FACTORS.EQUIVALENTS.KM_AVOIDED_PER_KG),
    ledHours: Math.round(reductionAmount * EMISSION_FACTORS.EQUIVALENTS.LED_HOURS_PER_KG),
  };
}

export function calculateAchievementUnlocks(reductionPercentage: number): string[] {
  const unlocks: string[] = [];
  if (reductionPercentage >= 10) unlocks.push("Eco Planner");
  if (reductionPercentage >= 20) unlocks.push("Future Saver");
  if (reductionPercentage >= 30) unlocks.push("Carbon Strategist");
  return unlocks;
}
