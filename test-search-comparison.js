/**
 * Search Comparison Test
 *
 * This script compares search parameters and results between:
 * 1. Live Meqasa site (https://meqasa.com)
 * 2. Our local implementation
 *
 * Usage:
 * 1. Run this script: node test-search-comparison.js
 * 2. Manually perform the same searches on https://meqasa.com/properties-for-rent-in-ghana
 * 3. Compare the results count and parameters
 */

const https = require("https");
const querystring = require("querystring");

// Color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
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

// Test scenarios to compare
const testScenarios = [
  {
    name: "Basic Search - All Properties for Rent in Ghana",
    contract: "rent",
    locality: "ghana",
    params: {
      app: "vercel",
    },
    expectedUrl: "https://meqasa.com/properties-for-rent-in-ghana",
    manualCheckUrl: "https://meqasa.com/properties-for-rent-in-ghana",
  },
  {
    name: "Filter by Property Type - Apartments for Rent",
    contract: "rent",
    locality: "ghana",
    params: {
      app: "vercel",
      ftype: "apartment",
    },
    expectedUrl: "https://meqasa.com/properties-for-rent-in-ghana",
    manualCheckUrl:
      "https://meqasa.com/properties-for-rent-in-ghana (Filter: Type > Apartment)",
  },
  {
    name: "Filter by Property Type - Houses for Rent",
    contract: "rent",
    locality: "ghana",
    params: {
      app: "vercel",
      ftype: "house",
    },
    expectedUrl: "https://meqasa.com/properties-for-rent-in-ghana",
    manualCheckUrl:
      "https://meqasa.com/properties-for-rent-in-ghana (Filter: Type > House)",
  },
  {
    name: "Filter by Bedrooms - 3 Bedrooms",
    contract: "rent",
    locality: "ghana",
    params: {
      app: "vercel",
      fbeds: "3",
    },
    expectedUrl: "https://meqasa.com/properties-for-rent-in-ghana",
    manualCheckUrl:
      "https://meqasa.com/properties-for-rent-in-ghana (Filter: Beds > 3)",
  },
  {
    name: "Filter by Location - Accra",
    contract: "rent",
    locality: "accra",
    params: {
      app: "vercel",
    },
    expectedUrl: "https://meqasa.com/properties-for-rent-in-accra",
    manualCheckUrl: "https://meqasa.com/properties-for-rent-in-accra",
  },
  {
    name: "Multiple Filters - 2 Bed Apartments in Accra",
    contract: "rent",
    locality: "accra",
    params: {
      app: "vercel",
      ftype: "apartment",
      fbeds: "2",
    },
    expectedUrl: "https://meqasa.com/properties-for-rent-in-accra",
    manualCheckUrl:
      "https://meqasa.com/properties-for-rent-in-accra (Filter: Type > Apartment, Beds > 2)",
  },
  {
    name: "Price Range Filter - 1000-5000 GHS",
    contract: "rent",
    locality: "ghana",
    params: {
      app: "vercel",
      fmin: "1000",
      fmax: "5000",
    },
    expectedUrl: "https://meqasa.com/properties-for-rent-in-ghana",
    manualCheckUrl:
      "https://meqasa.com/properties-for-rent-in-ghana (Filter: Price 1000-5000)",
  },
  {
    name: "Furnished Properties",
    contract: "rent",
    locality: "ghana",
    params: {
      app: "vercel",
      fisfurnished: "1",
    },
    expectedUrl: "https://meqasa.com/properties-for-rent-in-ghana",
    manualCheckUrl:
      "https://meqasa.com/properties-for-rent-in-ghana (Filter: Furnished Only)",
  },
  {
    name: "For Sale - Houses in Accra",
    contract: "sale",
    locality: "accra",
    params: {
      app: "vercel",
      ftype: "house",
    },
    expectedUrl: "https://meqasa.com/properties-for-sale-in-accra",
    manualCheckUrl:
      "https://meqasa.com/properties-for-sale-in-accra (Filter: Type > House)",
  },
  {
    name: "Short-let Properties (Daily)",
    contract: "rent",
    locality: "ghana",
    params: {
      app: "vercel",
      frentperiod: "shortrent",
      ftype: "- Any -",
      fhowshort: "daily",
    },
    expectedUrl: "https://meqasa.com/short-lease-properties-for-rent-in-ghana",
    manualCheckUrl:
      "https://meqasa.com/properties-for-rent-in-ghana (Filter: Rent Period > Daily)",
  },
  {
    name: "Office Spaces for Rent",
    contract: "rent",
    locality: "ghana",
    params: {
      app: "vercel",
      ftype: "office",
    },
    expectedUrl: "https://meqasa.com/properties-for-rent-in-ghana",
    manualCheckUrl:
      "https://meqasa.com/properties-for-rent-in-ghana (Filter: Type > Office)",
  },
  {
    name: "Sort by Price - Highest to Lowest",
    contract: "rent",
    locality: "ghana",
    params: {
      app: "vercel",
      fsort: "pricedown",
    },
    expectedUrl: "https://meqasa.com/properties-for-rent-in-ghana",
    manualCheckUrl:
      "https://meqasa.com/properties-for-rent-in-ghana (Sort: Highest-to-lowest price)",
  },
];

/**
 * Make a POST request to Meqasa API directly (simulating what the live site does)
 */
function makeDirectMeqasaRequest(url, postParams) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const body = querystring.stringify(postParams);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
          });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(body);
    req.end();
  });
}

/**
 * Run a single test scenario
 */
async function runTestScenario(scenario, index) {
  logSubsection(`Test ${index + 1}: ${scenario.name}`);

  // Build the API URL
  const apiUrl = scenario.expectedUrl;
  const postParams = { ...scenario.params };

  // Set default ftype if not provided (matching our implementation)
  if (!postParams.ftype) {
    postParams.ftype = "- Any -";
  }

  log(`\n📍 API Endpoint: ${apiUrl}`, colors.cyan);
  log(`📝 Method: POST`, colors.cyan);
  log(`🔧 POST Parameters:`, colors.yellow);
  Object.entries(postParams).forEach(([key, value]) => {
    console.log(`   ${key} = ${value}`);
  });
  log(`\n🌐 Manual Check URL: ${scenario.manualCheckUrl}`, colors.green);

  try {
    log(`\n⏳ Making request to live Meqasa API...`, colors.yellow);
    const result = await makeDirectMeqasaRequest(apiUrl, postParams);

    if (result.status === 200 && result.data) {
      const resultCount = result.data.resultcount || 0;
      const resultsLength = result.data.results?.length || 0;
      const searchId = result.data.searchid;
      const searchDesc = result.data.searchdesc;

      log(`\n✅ SUCCESS`, colors.green);
      log(`📊 Result Count: ${resultCount}`, colors.bright);
      log(`📋 Results Returned: ${resultsLength}`, colors.bright);
      log(`🏷️  Search ID: ${searchId}`);
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
        console.log(`   Location: ${firstProperty.locationstring}`);
      }

      return {
        success: true,
        scenario: scenario.name,
        resultCount,
        resultsLength,
        searchId,
        params: postParams,
      };
    } else {
      log(`\n❌ FAILED - HTTP ${result.status}`, colors.red);
      return {
        success: false,
        scenario: scenario.name,
        error: `HTTP ${result.status}`,
      };
    }
  } catch (error) {
    log(`\n❌ ERROR: ${error.message}`, colors.red);
    return {
      success: false,
      scenario: scenario.name,
      error: error.message,
    };
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  logSection("🔍 MEQASA SEARCH COMPARISON TEST");

  log("This test will:", colors.yellow);
  log("1. Make direct API calls to the live Meqasa API");
  log("2. Show the exact parameters being sent");
  log("3. Display the results count for comparison");
  log("4. Provide URLs for manual verification\n");

  log("INSTRUCTIONS:", colors.bright + colors.yellow);
  log("1. For each test, note the result count shown below");
  log('2. Visit the "Manual Check URL" in your browser');
  log("3. Apply the specified filters and verify the count matches");
  log("4. Then test the same search in your local implementation\n");

  const results = [];

  for (let i = 0; i < testScenarios.length; i++) {
    const result = await runTestScenario(testScenarios[i], i);
    results.push(result);

    // Add delay between requests to avoid rate limiting
    if (i < testScenarios.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Summary
  logSection("📈 TEST SUMMARY");

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  log(`Total Tests: ${results.length}`, colors.bright);
  log(`Successful: ${successCount}`, colors.green);
  log(`Failed: ${failCount}`, failCount > 0 ? colors.red : colors.green);

  log("\n📊 RESULTS BREAKDOWN:", colors.bright);
  results.forEach((result, index) => {
    if (result.success) {
      log(`\n${index + 1}. ${result.scenario}`, colors.cyan);
      log(`   ✅ ${result.resultCount} properties found`, colors.green);
      log(`   Parameters: ${JSON.stringify(result.params)}`);
    } else {
      log(`\n${index + 1}. ${result.scenario}`, colors.cyan);
      log(`   ❌ ${result.error}`, colors.red);
    }
  });

  log("\n\n📝 NEXT STEPS:", colors.bright + colors.yellow);
  log("1. Review the parameters being sent for each search");
  log("2. Verify your implementation sends the same parameters");
  log("3. Test each scenario in your local app and compare counts");
  log("4. Check the network tab in browser DevTools when using the live site");
  log("5. Ensure parameter names, values, and format match exactly\n");
}

// Run the tests
runAllTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
