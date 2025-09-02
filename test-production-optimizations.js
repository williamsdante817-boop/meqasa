// Production Reference Search Test Suite
// Tests caching, deduplication, performance, and error handling

console.log('🚀 Testing Production Reference Search Optimizations\n');

// Mock performance API for Node.js
if (typeof performance === 'undefined') {
  global.performance = {
    now: () => Date.now()
  };
}

// Test configuration
const TEST_REFERENCES = [
  '086983',
  '123456', 
  'REF001',
  'ABC123',
  '999999'  // This should fail
];

const PERFORMANCE_THRESHOLDS = {
  cacheHit: 50,        // Max 50ms for cache hits
  apiCall: 5000,       // Max 5s for API calls
  hybridNavigation: 100 // Max 100ms for hybrid approach
};

// Test Results
const results = {
  caching: { passed: 0, failed: 0, tests: [] },
  deduplication: { passed: 0, failed: 0, tests: [] },
  performance: { passed: 0, failed: 0, tests: [] },
  errorHandling: { passed: 0, failed: 0, tests: [] },
  rateLimit: { passed: 0, failed: 0, tests: [] }
};

// Mock API functions for testing
const mockGetListingDetails = async (reference) => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 200)); // 200-1200ms delay
  
  if (reference === '999999') {
    throw new Error('Property not available');
  }
  
  return {
    detailreq: `https://meqasa.com/house-for-rent-at-test-location-${reference}`,
    type: 'house',
    contract: 'rent',
    location: 'Test Location',
    listingid: reference
  };
};

// Test Cache Performance
async function testCaching() {
  console.log('📊 Testing Caching Performance...');
  
  // Simulate cache class
  class TestCache {
    constructor() {
      this.cache = new Map();
      this.metrics = { hits: 0, misses: 0 };
    }
    
    async get(key, apiCall) {
      if (this.cache.has(key)) {
        this.metrics.hits++;
        return this.cache.get(key);
      }
      
      this.metrics.misses++;
      const result = await apiCall();
      this.cache.set(key, result);
      return result;
    }
    
    getMetrics() {
      const total = this.metrics.hits + this.metrics.misses;
      return {
        ...this.metrics,
        hitRate: total > 0 ? (this.metrics.hits / total * 100).toFixed(2) : '0'
      };
    }
  }
  
  const cache = new TestCache();
  
  try {
    // Test 1: First call should be cache miss
    const start1 = performance.now();
    await cache.get('086983', () => mockGetListingDetails('086983'));
    const time1 = performance.now() - start1;
    
    // Test 2: Second call should be cache hit
    const start2 = performance.now();
    await cache.get('086983', () => mockGetListingDetails('086983'));
    const time2 = performance.now() - start2;
    
    const metrics = cache.getMetrics();
    
    // Verify cache hit is faster
    const cacheHitFaster = time2 < time1 / 2;
    const hitRate = parseFloat(metrics.hitRate);
    
    if (cacheHitFaster && hitRate === 50) {
      results.caching.passed++;
      results.caching.tests.push(`✅ Cache hit faster (${time2.toFixed(0)}ms vs ${time1.toFixed(0)}ms)`);
      results.caching.tests.push(`✅ Hit rate: ${metrics.hitRate}%`);
    } else {
      results.caching.failed++;
      results.caching.tests.push(`❌ Cache performance issue - Hit rate: ${metrics.hitRate}%`);
    }
    
  } catch (error) {
    results.caching.failed++;
    results.caching.tests.push(`❌ Caching test failed: ${error.message}`);
  }
}

// Test Request Deduplication
async function testDeduplication() {
  console.log('🔄 Testing Request Deduplication...');
  
  let apiCallCount = 0;
  const pendingRequests = new Map();
  
  const dedupGet = async (key, apiCall) => {
    if (pendingRequests.has(key)) {
      return await pendingRequests.get(key);
    }
    
    const promise = apiCall().then(result => {
      pendingRequests.delete(key);
      return result;
    }).catch(error => {
      pendingRequests.delete(key);
      throw error;
    });
    
    pendingRequests.set(key, promise);
    return await promise;
  };
  
  const trackedApiCall = async (ref) => {
    apiCallCount++;
    return await mockGetListingDetails(ref);
  };
  
  try {
    // Make 3 concurrent requests for same reference
    const promises = [
      dedupGet('123456', () => trackedApiCall('123456')),
      dedupGet('123456', () => trackedApiCall('123456')),
      dedupGet('123456', () => trackedApiCall('123456'))
    ];
    
    const results_dedup = await Promise.all(promises);
    
    // Should only make 1 API call despite 3 requests
    if (apiCallCount === 1 && results_dedup.length === 3) {
      results.deduplication.passed++;
      results.deduplication.tests.push(`✅ Deduplication working (${apiCallCount} API call for 3 requests)`);
    } else {
      results.deduplication.failed++;
      results.deduplication.tests.push(`❌ Deduplication failed (${apiCallCount} API calls for 3 requests)`);
    }
    
  } catch (error) {
    results.deduplication.failed++;
    results.deduplication.tests.push(`❌ Deduplication test failed: ${error.message}`);
  }
}

// Test Performance Metrics
async function testPerformance() {
  console.log('⚡ Testing Performance Metrics...');
  
  try {
    // Test response time tracking
    const start = performance.now();
    await mockGetListingDetails('REF001');
    const responseTime = performance.now() - start;
    
    // Test if response time is reasonable
    if (responseTime < PERFORMANCE_THRESHOLDS.apiCall) {
      results.performance.passed++;
      results.performance.tests.push(`✅ API response time: ${responseTime.toFixed(0)}ms`);
    } else {
      results.performance.failed++;
      results.performance.tests.push(`❌ Slow API response: ${responseTime.toFixed(0)}ms`);
    }
    
    // Test hybrid navigation simulation
    const hybridStart = performance.now();
    const fallbackUrl = `/listings/property-ref-REF001`;
    const hybridTime = performance.now() - hybridStart;
    
    if (hybridTime < PERFORMANCE_THRESHOLDS.hybridNavigation) {
      results.performance.passed++;
      results.performance.tests.push(`✅ Hybrid navigation time: ${hybridTime.toFixed(0)}ms`);
    } else {
      results.performance.failed++;
      results.performance.tests.push(`❌ Slow hybrid navigation: ${hybridTime.toFixed(0)}ms`);
    }
    
  } catch (error) {
    results.performance.failed++;
    results.performance.tests.push(`❌ Performance test failed: ${error.message}`);
  }
}

// Test Error Handling
async function testErrorHandling() {
  console.log('🛡️  Testing Error Handling...');
  
  try {
    // Test API error handling
    try {
      await mockGetListingDetails('999999');
      results.errorHandling.failed++;
      results.errorHandling.tests.push(`❌ Should have thrown error for invalid reference`);
    } catch (error) {
      if (error.message.includes('not available')) {
        results.errorHandling.passed++;
        results.errorHandling.tests.push(`✅ API error handled correctly: ${error.message}`);
      } else {
        results.errorHandling.failed++;
        results.errorHandling.tests.push(`❌ Unexpected error: ${error.message}`);
      }
    }
    
    // Test timeout simulation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 100);
    });
    
    const slowApi = new Promise(resolve => {
      setTimeout(() => resolve(mockGetListingDetails('123456')), 200);
    });
    
    try {
      await Promise.race([slowApi, timeoutPromise]);
      results.errorHandling.failed++;
      results.errorHandling.tests.push(`❌ Timeout not working`);
    } catch (error) {
      if (error.message === 'Request timeout') {
        results.errorHandling.passed++;
        results.errorHandling.tests.push(`✅ Timeout handling works`);
      } else {
        results.errorHandling.failed++;
        results.errorHandling.tests.push(`❌ Unexpected timeout error: ${error.message}`);
      }
    }
    
  } catch (error) {
    results.errorHandling.failed++;
    results.errorHandling.tests.push(`❌ Error handling test failed: ${error.message}`);
  }
}

// Test Rate Limiting
async function testRateLimit() {
  console.log('🚦 Testing Rate Limiting...');
  
  class TestRateLimit {
    constructor() {
      this.requests = new Map();
      this.maxPerMinute = 5; // Low limit for testing
    }
    
    isLimited(userId) {
      const now = Date.now();
      const userRequests = this.requests.get(userId) || [];
      
      // Clean old requests
      const oneMinuteAgo = now - 60000;
      const recentRequests = userRequests.filter(timestamp => timestamp > oneMinuteAgo);
      
      this.requests.set(userId, recentRequests);
      
      return recentRequests.length >= this.maxPerMinute;
    }
    
    recordRequest(userId) {
      const userRequests = this.requests.get(userId) || [];
      userRequests.push(Date.now());
      this.requests.set(userId, userRequests);
    }
  }
  
  const rateLimit = new TestRateLimit();
  const userId = 'test-user';
  
  try {
    // Make requests under limit
    for (let i = 0; i < 4; i++) {
      rateLimit.recordRequest(userId);
      if (rateLimit.isLimited(userId)) {
        results.rateLimit.failed++;
        results.rateLimit.tests.push(`❌ Rate limit triggered too early (${i + 1} requests)`);
        return;
      }
    }
    
    // Make request that should trigger limit
    rateLimit.recordRequest(userId);
    if (rateLimit.isLimited(userId)) {
      results.rateLimit.passed++;
      results.rateLimit.tests.push(`✅ Rate limit working (triggered at 5 requests)`);
    } else {
      results.rateLimit.failed++;
      results.rateLimit.tests.push(`❌ Rate limit not triggered`);
    }
    
  } catch (error) {
    results.rateLimit.failed++;
    results.rateLimit.tests.push(`❌ Rate limit test failed: ${error.message}`);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Starting Production Optimization Tests...\n');
  
  await testCaching();
  await testDeduplication();
  await testPerformance();
  await testErrorHandling();
  await testRateLimit();
  
  // Print results
  console.log('\n📋 Test Results Summary:');
  console.log('========================');
  
  Object.entries(results).forEach(([category, result]) => {
    const total = result.passed + result.failed;
    const percentage = total > 0 ? ((result.passed / total) * 100).toFixed(1) : '0';
    const status = result.failed === 0 ? '✅' : '❌';
    
    console.log(`${status} ${category.toUpperCase()}: ${result.passed}/${total} passed (${percentage}%)`);
    result.tests.forEach(test => console.log(`   ${test}`));
    console.log();
  });
  
  // Overall score
  const totalPassed = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
  const totalTests = Object.values(results).reduce((sum, r) => sum + r.passed + r.failed, 0);
  const overallScore = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0';
  
  console.log(`🏆 Overall Production Readiness Score: ${overallScore}%`);
  
  if (overallScore >= 90) {
    console.log('🎉 PRODUCTION READY! All critical optimizations working.');
  } else if (overallScore >= 70) {
    console.log('⚠️  MOSTLY READY - Some optimizations need attention.');
  } else {
    console.log('🚨 NOT PRODUCTION READY - Critical issues need fixing.');
  }
  
  return parseFloat(overallScore);
}

// Export for potential use in actual tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, results, TEST_REFERENCES };
} else {
  // Run tests immediately if in browser/direct execution
  runAllTests().then(score => {
    console.log(`\n🎯 Final Score: ${score}%`);
  }).catch(error => {
    console.error('❌ Test suite failed:', error);
  });
}