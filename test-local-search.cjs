/**
 * Local Search Implementation Test
 *
 * This script tests our local implementation and compares results with the live site
 *
 * Usage:
 * 1. Start your local dev server: npm run dev
 * 2. Run this script: node test-local-search.cjs
 * 3. Compare results with test-search-comparison.cjs output
 */

const http = require("http");

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log("\n" + "=".repeat(80));
  log(title, colors.bright + colors.blue);
  console.log("=".repeat(80) + "\n");
}

function logSubsection(title) {
  log(`\n${"─".repeat(60)}`, colors.cyan);
  log(title, colors.cyan);
  log("─".repeat(60), colors.cyan);
}

// Expected results from live site (from test-search-comparison.cjs output)
const expectedResults = {
  "Basic Search - All Properties for Rent in Ghana": 11739,
  "Filter by Property Type - Apartments for Rent": 6150,
  "Filter by Property Type - Houses for Rent": 4227,
  "Filter by Bedrooms - 3 Bedrooms": 3439,
  "Filter by Location - Accra": 5611,
  "Multiple Filters - 2 Bed Apartments in Accra": 1503,
  "Price Range Filter - 1000-5000 GHS": 1331,
  "Furnished Properties": 4502,
  "For Sale - Houses in Accra": 3694,
  "Short-let Properties (Daily)": 2095,
  "Office Spaces for Rent": 634,
  "Sort by Price - Highest to Lowest": 11739,
};

// Test scenarios matching the live site tests
const testScenarios = [
  {
    name: "Basic Search - All Properties for Rent in Ghana",
    queryParams: {
      type: "search",
      contract: "rent",
      locality: "ghana",
      app: "vercel",
    },
  },
  {
    name: "Filter by Property Type - Apartments for Rent",
    queryParams: {
      type: "search",
      contract: "rent",
      locality: "ghana",
      app: "vercel",
      ftype: "apartment",
    },
  },
  {
    name: "Filter by Property Type - Houses for Rent",
    queryParams: {
      type: "search",
      contract: "rent",
      locality: "ghana",
      app: "vercel",
      ftype: "house",
    },
  },
  {
    name: "Filter by Bedrooms - 3 Bedrooms",
    queryParams: {
      type: "search",
      contract: "rent",
      locality: "ghana",
      app: "vercel",
      fbeds: "3",
    },
  },
  {
    name: "Filter by Location - Accra",
    queryParams: {
      type: "search",
      contract: "rent",
      locality: "accra",
      app: "vercel",
    },
  },
  {
    name: "Multiple Filters - 2 Bed Apartments in Accra",
    queryParams: {
      type: "search",
      contract: "rent",
      locality: "accra",
      app: "vercel",
      ftype: "apartment",
      fbeds: "2",
    },
  },
  {
    name: "Price Range Filter - 1000-5000 GHS",
    queryParams: {
      type: "search",
      contract: "rent",
      locality: "ghana",
      app: "vercel",
      fmin: "1000",
      fmax: "5000",
    },
  },
  {
    name: "Furnished Properties",
    queryParams: {
      type: "search",
      contract: "rent",
      locality: "ghana",
      app: "vercel",
      fisfurnished: "1",
    },
  },
  {
    name: "For Sale - Houses in Accra",
    queryParams: {
      type: "search",
      contract: "sale",
      locality: "accra",
      app: "vercel",
      ftype: "house",
    },
  },
  {
    name: "Short-let Properties (Daily)",
    queryParams: {
      type: "search",
      contract: "rent",
      locality: "ghana",
      app: "vercel",
      frentperiod: "shortrent",
      ftype: "- Any -",
      fhowshort: "daily",
    },
  },
  {
    name: "Office Spaces for Rent",
    queryParams: {
      type: "search",
      contract: "rent",
      locality: "ghana",
      app: "vercel",
      ftype: "office",
    },
  },
  {
    name: "Sort by Price - Highest to Lowest",
    queryParams: {
      type: "search",
      contract: "rent",
      locality: "ghana",
      app: "vercel",
      fsort: "pricedown",
    },
  },
];

/**
 * Make a request to local API
 */
function makeLocalRequest(queryParams, port = 3000) {
  return new Promise((resolve, reject) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const path = `/api/properties?${queryString}`;

    const options = {
      hostname: "localhost",
      port,
      path,
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            resolve({
              status: res.statusCode,
              data: jsonData,
            });
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.end();
  });
}

/**
 * Run a single test scenario
 */
async function runTestScenario(scenario, index) {
  logSubsection(`Test ${index + 1}: ${scenario.name}`);

  const expectedCount = expectedResults[scenario.name];
  log(
    `\n📊 Expected Result Count (from live site): ${expectedCount}`,
    colors.yellow
  );
  log(`🔧 Query Parameters:`, colors.cyan);
  Object.entries(scenario.queryParams).forEach(([key, value]) => {
    console.log(`   ${key} = ${value}`);
  });

  try {
    log(`\n⏳ Making request to local API...`, colors.yellow);
    const result = await makeLocalRequest(scenario.queryParams);

    if (result.status === 200 && result.data) {
      const resultCount = result.data.resultcount || 0;
      const resultsLength = result.data.results?.length || 0;
      const searchId = result.data.searchid;
      const searchDesc = result.data.searchdesc;

      const matches = resultCount === expectedCount;
      const statusColor = matches ? colors.green : colors.red;
      const statusIcon = matches ? "✅" : "❌";

      log(`\n${statusIcon} ${matches ? "MATCH" : "MISMATCH"}`, statusColor);
      log(`📊 Result Count: ${resultCount}`, colors.bright);
      log(`📋 Results Returned: ${resultsLength}`, colors.bright);
      log(`🏷️  Search ID: ${searchId}`);

      if (!matches) {
        const diff = resultCount - expectedCount;
        const diffSign = diff > 0 ? "+" : "";
        log(
          `⚠️  Difference: ${diffSign}${diff} (${Math.abs(diff)} ${diff > 0 ? "more" : "fewer"} than expected)`,
          colors.red
        );
      }

      if (searchDesc) {
        log(`📝 Search Description: ${searchDesc}`);
      }

      // Show first property as sample
      if (result.data.results && result.data.results.length > 0) {
        const firstProperty = result.data.results[0];
        log(`\n🏡 Sample Property:`, colors.cyan);
        console.log(`   ID: ${firstProperty.listingid}`);
        console.log(
          `   Summary: ${firstProperty.summary?.substring(0, 60)}...`
        );
        console.log(
          `   Price: ${firstProperty.pricepart1} ${firstProperty.pricepart2 || ""}`
        );
        console.log(`   Type: ${firstProperty.type}`);
      }

      return {
        success: true,
        scenario: scenario.name,
        resultCount,
        expectedCount,
        matches,
        resultsLength,
        searchId,
      };
    } else {
      log(`\n❌ FAILED - HTTP ${result.status}`, colors.red);
      return {
        success: false,
        scenario: scenario.name,
        expectedCount,
        error: `HTTP ${result.status}`,
      };
    }
  } catch (error) {
    log(`\n❌ ERROR: ${error.message}`, colors.red);
    if (error.message.includes("ECONNREFUSED")) {
      log(
        `\n💡 TIP: Make sure your dev server is running with "npm run dev"`,
        colors.yellow
      );
    }
    return {
      success: false,
      scenario: scenario.name,
      expectedCount,
      error: error.message,
    };
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  logSection("🔍 LOCAL SEARCH IMPLEMENTATION TEST");

  log("This test will:", colors.yellow);
  log("1. Make requests to your local /api/properties endpoint");
  log("2. Compare result counts with the live Meqasa site");
  log("3. Report any mismatches for investigation\n");

  log("PREREQUISITES:", colors.bright + colors.yellow);
  log("1. Your dev server must be running (npm run dev)");
  log("2. The server should be accessible at http://localhost:3000");
  log("3. Run test-search-comparison.cjs first to get expected counts\n");

  const results = [];

  for (let i = 0; i < testScenarios.length; i++) {
    const result = await runTestScenario(testScenarios[i], i);
    results.push(result);

    // Add delay between requests
    if (i < testScenarios.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Summary
  logSection("📈 TEST SUMMARY");

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;
  const matchCount = results.filter((r) => r.success && r.matches).length;
  const mismatchCount = results.filter((r) => r.success && !r.matches).length;

  log(`Total Tests: ${results.length}`, colors.bright);
  log(
    `Successful Requests: ${successCount}`,
    successCount === results.length ? colors.green : colors.yellow
  );
  log(
    `Failed Requests: ${failCount}`,
    failCount > 0 ? colors.red : colors.green
  );
  log(
    `Matching Counts: ${matchCount}`,
    matchCount === successCount ? colors.green : colors.yellow
  );
  log(
    `Mismatched Counts: ${mismatchCount}`,
    mismatchCount > 0 ? colors.red : colors.green
  );

  if (mismatchCount > 0) {
    log("\n⚠️  MISMATCHES DETECTED:", colors.bright + colors.yellow);
    results.forEach((result, index) => {
      if (result.success && !result.matches) {
        const diff = result.resultCount - result.expectedCount;
        const diffSign = diff > 0 ? "+" : "";
        log(`\n${index + 1}. ${result.scenario}`, colors.cyan);
        log(`   Expected: ${result.expectedCount}`, colors.yellow);
        log(`   Got: ${result.resultCount}`, colors.red);
        log(`   Difference: ${diffSign}${diff}`, colors.red);
      }
    });
  }

  log("\n\n📊 DETAILED RESULTS:", colors.bright);
  results.forEach((result, index) => {
    if (result.success) {
      const statusIcon = result.matches ? "✅" : "❌";
      const statusColor = result.matches ? colors.green : colors.red;
      log(`\n${index + 1}. ${result.scenario}`, colors.cyan);
      log(
        `   ${statusIcon} Expected: ${result.expectedCount} | Got: ${result.resultCount}`,
        statusColor
      );
    } else {
      log(`\n${index + 1}. ${result.scenario}`, colors.cyan);
      log(`   ❌ ${result.error}`, colors.red);
    }
  });

  const allMatch =
    matchCount === successCount && successCount === results.length;

  if (allMatch) {
    log(
      "\n\n🎉 SUCCESS! All tests passed and counts match the live site!",
      colors.bright + colors.green
    );
  } else if (failCount > 0) {
    log(
      "\n\n⚠️  Some tests failed to execute. Check the errors above.",
      colors.bright + colors.red
    );
  } else if (mismatchCount > 0) {
    log(
      "\n\n⚠️  Some result counts don't match the live site. Investigation needed.",
      colors.bright + colors.yellow
    );
  }

  log("\n\n📝 NEXT STEPS:", colors.bright + colors.yellow);
  if (!allMatch) {
    log("1. Review the mismatches and errors above");
    log("2. Check your /api/properties implementation");
    log("3. Verify parameters are being sent correctly");
    log("4. Compare network requests with live site using browser DevTools");
    log("5. Check if any parameter mapping or filtering logic differs\n");
  } else {
    log("1. Your implementation matches the live site perfectly!");
    log("2. Consider running more edge case tests");
    log("3. Test with different locations and filters\n");
  }
}

// Run the tests
runAllTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
