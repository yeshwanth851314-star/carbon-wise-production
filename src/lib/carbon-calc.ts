export interface CarbonInput {
  transport: {
    vehicleType: string;
    weeklyDistance: number;
  };
  energy: {
    monthlyElectricity: number;
    acUsageHours: number;
  };
  food: {
    dietType: string;
  };
  shopping: {
    frequency: string;
  };
  waste: {
    recycling: string;
    plasticUsage: string;
  };
}

export interface CarbonOutput {
  totalCarbonKg: number;
  sustainabilityScore: number;
  transportEmission: number;
  energyEmission: number;
  foodEmission: number;
  shoppingEmission: number;
  wasteEmission: number;
}

export function calculateCarbonFootprint(data: CarbonInput): CarbonOutput {
  // Transport
  // Avg car: 0.2 kg CO2 per km. Bus: 0.08. Bike/Walk: 0
  let transportFactor = 0.2;
  if (data.transport.vehicleType === "Public Transit") transportFactor = 0.08;
  if (data.transport.vehicleType === "Bicycle/Walk") transportFactor = 0;
  if (data.transport.vehicleType === "Electric Vehicle") transportFactor = 0.05;

  const transportEmission = data.transport.weeklyDistance * transportFactor * 4; // Monthly

  // Energy
  // ~0.85 kg CO2 per kWh, AC uses ~1.5 kWh per hour
  const baseElectricityEmission = data.energy.monthlyElectricity * 0.85;
  const acEmission = data.energy.acUsageHours * 30 * 1.5 * 0.85;
  const energyEmission = baseElectricityEmission + acEmission;

  // Food
  // Monthly emissions (approx kg CO2): Vegan 60, Vegetarian 80, Mixed 150, Heavy Meat 250
  let foodEmission = 150;
  if (data.food.dietType === "Vegan") foodEmission = 60;
  if (data.food.dietType === "Vegetarian") foodEmission = 80;
  if (data.food.dietType === "Heavy Meat") foodEmission = 250;

  // Shopping
  // Monthly: Rarely 20, Monthly 50, Weekly 120, Frequent 200
  let shoppingEmission = 50;
  if (data.shopping.frequency === "Rarely") shoppingEmission = 20;
  if (data.shopping.frequency === "Weekly") shoppingEmission = 120;
  if (data.shopping.frequency === "Frequent") shoppingEmission = 200;

  // Waste
  // Baseline ~40 kg. Recycling saves 15. High plastic adds 20.
  let wasteEmission = 40;
  if (data.waste.recycling === "Always") wasteEmission -= 15;
  if (data.waste.recycling === "Never") wasteEmission += 10;

  if (data.waste.plasticUsage === "High") wasteEmission += 20;
  if (data.waste.plasticUsage === "Low") wasteEmission -= 10;

  // Ensure non-negative
  wasteEmission = Math.max(0, wasteEmission);

  const totalCarbonKg =
    transportEmission +
    energyEmission +
    foodEmission +
    shoppingEmission +
    wasteEmission;

  // Calculate Sustainability Score (0-100)
  // Avg human footprint ~ 400 kg/month.
  // 100 score = < 100 kg. 0 score = > 1000 kg.
  let score = 100 - (totalCarbonKg - 100) / 9;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    totalCarbonKg: Math.round(totalCarbonKg),
    sustainabilityScore: score,
    transportEmission: Math.round(transportEmission),
    energyEmission: Math.round(energyEmission),
    foodEmission: Math.round(foodEmission),
    shoppingEmission: Math.round(shoppingEmission),
    wasteEmission: Math.round(wasteEmission),
  };
}
