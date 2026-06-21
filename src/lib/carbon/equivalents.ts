export interface EnvironmentalEquivalents {
  treesEquivalent: number;
  drivingEquivalent: number; // km
  electricityEquivalent: number; // hours of LED
  householdEnergyEquivalent: number; // months of average household energy
  flightsEquivalent: number; // short-haul flights
  waterEquivalent: number; // liters of water saved
}

/**
 * Converts kg of CO2 into tangible real-world equivalents.
 * Helps users visualize their carbon footprint in relatable terms.
 * 
 * @param kgCO2 The carbon footprint or reduction amount in kg CO₂
 * @returns An object containing equivalent values for trees, driving, electricity, etc.
 * 
 * @example
 * const equivalents = calculateEnvironmentalEquivalents(100);
 * console.log(`That's like planting ${equivalents.treesEquivalent} trees!`);
 */
export function calculateEnvironmentalEquivalents(kgCO2: number): EnvironmentalEquivalents {
  const footprint = Math.max(0, kgCO2);
  
  // 1 mature tree absorbs ~25kg of CO2 per year
  const treesEquivalent = Math.round(footprint / 25);
  
  // Avg passenger vehicle emits ~0.24 kg CO2 per km
  const drivingEquivalent = Math.round(footprint / 0.24);
  
  // 1 kg CO2 = ~2.5 hours of a 10W LED bulb (Very rough metric. Let's use standard: ~0.4 kg per kWh)
  // footprint / 0.4 = kWh. 10W LED uses 0.01 kW per hour.
  // Hours = kWh / 0.01 = footprint / 0.004
  const electricityEquivalent = Math.round(footprint / 0.004);
  
  // Avg household uses ~250 kWh/month -> ~100 kg CO2/month
  const householdEnergyEquivalent = Math.round((footprint / 100) * 10) / 10; // 1 decimal
  
  // 1 short haul flight (e.g., 2 hours) is ~150 kg CO2 per passenger
  const flightsEquivalent = Math.round((footprint / 150) * 10) / 10;
  
  // Water desalination/treatment is energy intensive. ~0.005 kg CO2 per liter
  const waterEquivalent = Math.round(footprint / 0.005);

  return {
    treesEquivalent,
    drivingEquivalent,
    electricityEquivalent,
    householdEnergyEquivalent,
    flightsEquivalent,
    waterEquivalent
  };
}
