/* eslint-disable */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("Starting CarbonWise AI Performance & Build Audit...\n");

try {
  // 1. Check build process
  console.log("1. Running Next.js Build Analysis...");
  const startTime = Date.now();
  
  // Run build command and capture output
  const buildOutput = execSync('npm run build', { encoding: 'utf8', stdio: 'pipe' });
  const buildTime = (Date.now() - startTime) / 1000;
  
  console.log(`✅ Build completed in ${buildTime.toFixed(2)} seconds.\n`);

  // 2. Extract Route Sizes
  console.log("2. Analyzing Bundle Sizes...");
  
  const lines = buildOutput.split('\n');
  let inRouteTable = false;
  
  lines.forEach(line => {
    if (line.includes('Route (app)') || line.includes('Page')) {
      inRouteTable = true;
      console.log(line.trim());
    } else if (inRouteTable) {
      if (line.trim() === '') {
        inRouteTable = false;
      } else {
        // Highlight routes that might be too large (> 150kB First Load JS)
        const isLarge = line.includes('kB') && parseInt(line.match(/(\d+(?:\.\d+)?)\s*kB/)?.[1] || "0") > 150;
        if (isLarge) {
          console.log(`⚠️ ${line.trim()} - Consider optimizing this route`);
        } else {
          console.log(`  ${line.trim()}`);
        }
      }
    }
  });

  // 3. Security/Audit dependencies
  console.log("\n3. Running Dependency Audit...");
  try {
    execSync('npm audit', { encoding: 'utf8', stdio: 'pipe' });
    console.log("✅ No significant dependency vulnerabilities found.");
  } catch (error) {
    console.log("⚠️ Some vulnerabilities found in dependencies. Run 'npm audit' for details.");
  }

  console.log("\nAudit Complete! 🎉");

} catch (error) {
  console.error("❌ Audit failed during build process.");
  console.error(error.message);
  if (error.stdout) console.log(error.stdout);
}
