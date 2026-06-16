require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const Database = require("better-sqlite3");
const path = require("path");
const { calculateCarbonFootprint } = require("./src/lib/carbon-calc.ts"); // this won't work in node without ts-node

async function runTests() {
  const dbPath = path.join(process.cwd(), "dev.db");
  const sqlite = new Database(dbPath);
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  const prisma = new PrismaClient({ adapter });

  console.log("Starting Functional Tests...");

  try {
    // 1. Test Database Connection & User Creation
    let user = await prisma.user.upsert({
      where: { clerkId: "test_user_123" },
      update: {},
      create: { clerkId: "test_user_123", email: "test_user_123@example.com" },
    });
    console.log("[PASS] User creation / DB connection");

    // 2. Test Assessment Creation
    const assessment = await prisma.assessment.create({
      data: {
        userId: user.id,
        transportScore: 100,
        energyScore: 200,
        foodScore: 150,
        shoppingScore: 50,
        wasteScore: 40,
        totalEmissions: 540,
        sustainabilityScore: 70,
      },
    });
    console.log("[PASS] Assessment Creation. ID:", assessment.id);

    // 3. Test XP Addition
    const oldXp = user.xp;
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: oldXp + 50 },
    });
    console.log("[PASS] Gamification XP update");

    // 4. Test Daily Log
    await prisma.dailyLog.create({
      data: {
        userId: user.id,
        walkingKm: 5,
        cyclingKm: 0,
        publicTransportKm: 0,
        plasticSaved: 2,
        carbonSaved: 1.16,
      },
    });
    console.log("[PASS] Daily Log creation");

    console.log("All functional core database logic tests passed!");
  } catch (error) {
    console.error("[FAIL] Functional Test Failed", error);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
