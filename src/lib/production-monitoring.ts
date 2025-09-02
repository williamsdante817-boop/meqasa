/**
 * Production monitoring and rate limiting for reference search
 * Handles performance tracking, rate limiting, and error reporting
 */

interface PerformanceMetrics {
  searchCount: number;
  totalResponseTime: number;
  avgResponseTime: number;
  cacheHitRate: number;
  errorRate: number;
  lastHour: {
    searches: number;
    errors: number;
    avgResponseTime: number;
  };
}

interface RateLimitConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  blockDuration: number; // minutes
}

interface UserMetrics {
  requests: number[];
  blocked: boolean;
  blockedUntil?: number;
  totalRequests: number;
  totalErrors: number;
}

class ProductionMonitor {
  private userMetrics = new Map<string, UserMetrics>();
  private globalMetrics: PerformanceMetrics = {
    searchCount: 0,
    totalResponseTime: 0,
    avgResponseTime: 0,
    cacheHitRate: 0,
    errorRate: 0,
    lastHour: {
      searches: 0,
      errors: 0,
      avgResponseTime: 0
    }
  };

  private config: RateLimitConfig = {
    maxRequestsPerMinute: 30,
    maxRequestsPerHour: 200,
    blockDuration: 5 // 5 minutes
  };

  // Rate limiting
  isRateLimited(userId: string): { limited: boolean; reason?: string; resetTime?: number } {
    const user = this.getUserMetrics(userId);
    const now = Date.now();

    // Check if user is currently blocked
    if (user.blocked && user.blockedUntil && now < user.blockedUntil) {
      return {
        limited: true,
        reason: 'Temporarily blocked due to rate limit violation',
        resetTime: user.blockedUntil
      };
    }

    // Clear expired block
    if (user.blocked && user.blockedUntil && now >= user.blockedUntil) {
      user.blocked = false;
      user.blockedUntil = undefined;
    }

    // Clean old requests (older than 1 hour)
    const oneHourAgo = now - (60 * 60 * 1000);
    user.requests = user.requests.filter(timestamp => timestamp > oneHourAgo);

    // Check hourly limit
    if (user.requests.length >= this.config.maxRequestsPerHour) {
      return {
        limited: true,
        reason: 'Hourly rate limit exceeded',
        resetTime: Math.min(...user.requests) + (60 * 60 * 1000)
      };
    }

    // Check per-minute limit
    const oneMinuteAgo = now - (60 * 1000);
    const recentRequests = user.requests.filter(timestamp => timestamp > oneMinuteAgo);
    
    if (recentRequests.length >= this.config.maxRequestsPerMinute) {
      // Block user for excessive requests
      user.blocked = true;
      user.blockedUntil = now + (this.config.blockDuration * 60 * 1000);
      
      return {
        limited: true,
        reason: 'Rate limit exceeded - temporarily blocked',
        resetTime: user.blockedUntil
      };
    }

    return { limited: false };
  }

  recordRequest(userId: string, responseTime: number, wasError = false): void {
    const user = this.getUserMetrics(userId);
    const now = Date.now();
    
    // Record request timestamp
    user.requests.push(now);
    user.totalRequests++;
    
    if (wasError) {
      user.totalErrors++;
    }

    // Update global metrics
    this.globalMetrics.searchCount++;
    this.globalMetrics.totalResponseTime += responseTime;
    this.globalMetrics.avgResponseTime = this.globalMetrics.totalResponseTime / this.globalMetrics.searchCount;

    // Update last hour metrics
    this.updateHourlyMetrics(responseTime, wasError);
  }

  private getUserMetrics(userId: string): UserMetrics {
    if (!this.userMetrics.has(userId)) {
      this.userMetrics.set(userId, {
        requests: [],
        blocked: false,
        totalRequests: 0,
        totalErrors: 0
      });
    }
    return this.userMetrics.get(userId)!;
  }

  private updateHourlyMetrics(responseTime: number, wasError: boolean): void {
    // const now = Date.now(); // Will be used when implementing sophisticated time window

    // This is a simplified approach - in production, you'd use a more sophisticated time window
    this.globalMetrics.lastHour.searches++;
    
    if (wasError) {
      this.globalMetrics.lastHour.errors++;
    }

    // Update hourly average response time
    const currentAvg = this.globalMetrics.lastHour.avgResponseTime;
    const count = this.globalMetrics.lastHour.searches;
    this.globalMetrics.lastHour.avgResponseTime = ((currentAvg * (count - 1)) + responseTime) / count;
  }

  getGlobalMetrics(): PerformanceMetrics {
    return { ...this.globalMetrics };
  }

  getUserStats(userId: string): {
    totalRequests: number;
    totalErrors: number;
    errorRate: number;
    isBlocked: boolean;
    blockedUntil?: number;
    recentRequests: number;
  } {
    const user = this.getUserMetrics(userId);
    const now = Date.now();
    const oneMinuteAgo = now - (60 * 1000);
    
    return {
      totalRequests: user.totalRequests,
      totalErrors: user.totalErrors,
      errorRate: user.totalRequests > 0 ? (user.totalErrors / user.totalRequests) * 100 : 0,
      isBlocked: user.blocked && !!user.blockedUntil && now < user.blockedUntil,
      blockedUntil: user.blockedUntil,
      recentRequests: user.requests.filter(timestamp => timestamp > oneMinuteAgo).length
    };
  }

  // Alert system for production issues
  checkAlerts(): Array<{ type: 'warning' | 'critical'; message: string; metric: number }> {
    const alerts: Array<{ type: 'warning' | 'critical'; message: string; metric: number }> = [];
    const metrics = this.globalMetrics;

    // High error rate
    if (metrics.errorRate > 25) {
      alerts.push({
        type: 'critical',
        message: 'High error rate detected',
        metric: metrics.errorRate
      });
    } else if (metrics.errorRate > 10) {
      alerts.push({
        type: 'warning',
        message: 'Elevated error rate',
        metric: metrics.errorRate
      });
    }

    // Slow response times
    if (metrics.avgResponseTime > 3000) {
      alerts.push({
        type: 'critical',
        message: 'Very slow response times',
        metric: metrics.avgResponseTime
      });
    } else if (metrics.avgResponseTime > 1500) {
      alerts.push({
        type: 'warning',
        message: 'Slow response times',
        metric: metrics.avgResponseTime
      });
    }

    // Low cache hit rate
    if (metrics.cacheHitRate < 30) {
      alerts.push({
        type: 'warning',
        message: 'Low cache efficiency',
        metric: metrics.cacheHitRate
      });
    }
    
    return alerts;
  }

  // Reset all metrics (for testing)
  reset(): void {
    this.userMetrics.clear();
    this.globalMetrics = {
      searchCount: 0,
      totalResponseTime: 0,
      avgResponseTime: 0,
      cacheHitRate: 0,
      errorRate: 0,
      lastHour: {
        searches: 0,
        errors: 0,
        avgResponseTime: 0
      }
    };
  }

  // Cleanup old data periodically
  cleanup(): void {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    for (const [userId, metrics] of this.userMetrics.entries()) {
      // Clean old requests
      metrics.requests = metrics.requests.filter(timestamp => timestamp > oneHourAgo);
      
      // Remove users with no recent activity
      if (metrics.requests.length === 0 && !metrics.blocked) {
        this.userMetrics.delete(userId);
      }
    }
  }
}

// Global monitor instance
export const productionMonitor = new ProductionMonitor();

// Cleanup task - run every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    productionMonitor.cleanup();
  }, 10 * 60 * 1000);
}

// Helper function to generate user ID (in production, use actual user ID)
export function generateUserId(): string {
  if (typeof window !== 'undefined') {
    // Use a combination of IP-like identifier and session
    const stored = localStorage.getItem('meqasa_user_id');
    if (stored) return stored;
    
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('meqasa_user_id', newId);
    return newId;
  }
  return `server_${Date.now()}`;
}

// Export rate limiting hook
export function useRateLimit() {
  const userId = generateUserId();
  
  return {
    checkRateLimit: () => productionMonitor.isRateLimited(userId),
    recordRequest: (responseTime: number, wasError = false) => 
      productionMonitor.recordRequest(userId, responseTime, wasError),
    getUserStats: () => productionMonitor.getUserStats(userId),
    getGlobalMetrics: () => productionMonitor.getGlobalMetrics(),
    getAlerts: () => productionMonitor.checkAlerts()
  };
}