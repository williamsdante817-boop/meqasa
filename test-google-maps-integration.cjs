/**
 * Test script to verify Google Maps API integration
 * Run this with: node test-google-maps-integration.js
 */

const https = require('https');
const querystring = require('querystring');

// Test configuration
const TEST_CONFIG = {
  apiKey: 'AIzaSyChgWOnCq6Be8MOPjtLiYHa29fMOMaQMiA',
  testLocation: 'East Legon, Accra, Ghana',
  establishmentTypes: ['school', 'bank', 'supermarket', 'hospital', 'airport']
};

// Test Google Geocoding API
async function testGeocode(location) {
  return new Promise((resolve, reject) => {
    const params = querystring.stringify({
      address: location,
      key: TEST_CONFIG.apiKey,
      region: 'gh'
    });
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?${params}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Test Google Places API
async function testNearbySearch(coordinates, type) {
  return new Promise((resolve, reject) => {
    const params = querystring.stringify({
      location: `${coordinates.lat},${coordinates.lng}`,
      radius: 5000,
      type: type,
      key: TEST_CONFIG.apiKey,
      language: 'en'
    });
    
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Test Text Search API
async function testTextSearch(query, location) {
  return new Promise((resolve, reject) => {
    const params = querystring.stringify({
      query: query,
      location: location ? `${location.lat},${location.lng}` : undefined,
      radius: location ? 5000 : undefined,
      key: TEST_CONFIG.apiKey,
      language: 'en'
    });
    
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Main test function
async function runTests() {
  console.log('🧪 Testing Google Maps API Integration');
  console.log('=====================================\n');
  
  try {
    // Test 1: Geocoding
    console.log(`📍 Test 1: Geocoding "${TEST_CONFIG.testLocation}"`);
    const geocodeResult = await testGeocode(TEST_CONFIG.testLocation);
    
    if (geocodeResult.status === 'OK' && geocodeResult.results.length > 0) {
      const location = geocodeResult.results[0];
      const coordinates = location.geometry.location;
      console.log(`✅ Success: ${location.formatted_address}`);
      console.log(`   Coordinates: ${coordinates.lat}, ${coordinates.lng}\n`);
      
      // Test 2: Nearby Search for each establishment type
      console.log('🏢 Test 2: Nearby Search for Establishments');
      for (const type of TEST_CONFIG.establishmentTypes) {
        try {
          console.log(`   Searching for ${type}s...`);
          const placesResult = await testNearbySearch(coordinates, type);
          
          if (placesResult.status === 'OK') {
            console.log(`   ✅ Found ${placesResult.results.length} ${type}s`);
            if (placesResult.results.length > 0) {
              const firstPlace = placesResult.results[0];
              console.log(`      Example: ${firstPlace.name} (Rating: ${firstPlace.rating || 'N/A'})`);
            }
          } else if (placesResult.status === 'ZERO_RESULTS') {
            console.log(`   ⚠️  No ${type}s found in the area`);
          } else {
            console.log(`   ❌ Error: ${placesResult.status} - ${placesResult.error_message || 'Unknown error'}`);
          }
        } catch (error) {
          console.log(`   ❌ Network error searching for ${type}s: ${error.message}`);
        }
      }
      
      // Test 3: Text Search Examples
      console.log('\n📝 Test 3: Text Search Examples');
      const textSearchQueries = [
        'schools near East Legon',
        'banks near East Legon', 
        'supermarkets near East Legon'
      ];
      
      for (const query of textSearchQueries) {
        try {
          console.log(`   Searching: "${query}"`);
          const textResult = await testTextSearch(query, coordinates);
          
          if (textResult.status === 'OK') {
            console.log(`   ✅ Found ${textResult.results.length} results`);
            if (textResult.results.length > 0) {
              const firstResult = textResult.results[0];
              console.log(`      Example: ${firstResult.name} at ${firstResult.formatted_address}`);
            }
          } else {
            console.log(`   ❌ Error: ${textResult.status}`);
          }
        } catch (error) {
          console.log(`   ❌ Network error for "${query}": ${error.message}`);
        }
      }
      
    } else {
      console.log(`❌ Geocoding failed: ${geocodeResult.status} - ${geocodeResult.error_message || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`);
  }
  
  console.log('\n🏁 Test Complete');
  console.log('================\n');
  console.log('📋 Next Steps:');
  console.log('1. If tests pass, your Google Maps API integration is working');
  console.log('2. The component will automatically use this API for real data');
  console.log('3. Check your Next.js app to see live establishment data');
  console.log('4. If any tests fail, check your API key permissions in Google Cloud Console');
}

// Run the tests
runTests().catch(console.error);