// Simple production logger utility
// Can be extended with external services like Sentry, LogRocket, etc.

export interface LogContext {
  component?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: any;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private static instance: Logger;
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getBaseContext(): LogContext {
    const timestamp = new Date().toISOString();
    
    if (!this.isClient) {
      return { timestamp, environment: 'server' };
    }

    return {
      timestamp,
      environment: 'client',
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId(),
    };
  }

  private getSessionId(): string {
    // Simple session ID generation for client-side
    if (!this.isClient) return '';
    
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const baseContext = this.getBaseContext();
    const fullContext = { ...baseContext, ...context };
    
    return JSON.stringify({
      level,
      message,
      ...fullContext,
    }, null, this.isDevelopment ? 2 : 0);
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors by default
    if (!this.isDevelopment) {
      return level === 'warn' || level === 'error';
    }
    return true;
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog('debug')) return;
    
    if (this.isDevelopment) {
      console.debug(`🐛 ${message}`, context);
    } else {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog('info')) return;
    
    if (this.isDevelopment) {
      console.info(`ℹ️ ${message}`, context);
    } else {
      console.info(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog('warn')) return;
    
    if (this.isDevelopment) {
      console.warn(`⚠️ ${message}`, context);
    } else {
      console.warn(this.formatMessage('warn', message, context));
    }

    // In production, you might want to send to external service
    this.sendToExternalService('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog('error')) return;
    
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    };

    if (this.isDevelopment) {
      console.error(`❌ ${message}`, errorContext);
    } else {
      console.error(this.formatMessage('error', message, errorContext));
    }

    // In production, you might want to send to external service
    this.sendToExternalService('error', message, errorContext);
  }

  private sendToExternalService(level: LogLevel, message: string, context?: LogContext): void {
    // This is where you'd integrate with Sentry, LogRocket, etc.
    // For now, we'll just store it for potential batch sending
    if (!this.isClient || this.isDevelopment) return;

    try {
      const logEntry = {
        level,
        message,
        ...this.getBaseContext(),
        ...context,
      };

      // Store in localStorage for potential batch sending
      const logs = JSON.parse(localStorage.getItem('pending_logs') || '[]');
      logs.push(logEntry);
      
      // Keep only last 50 logs to prevent storage bloat
      if (logs.length > 50) {
        logs.splice(0, logs.length - 50);
      }
      
      localStorage.setItem('pending_logs', JSON.stringify(logs));
    } catch (e) {
      // Silently fail if logging fails
      console.warn('Failed to store log entry:', e);
    }
  }

  // Method to retrieve pending logs (useful for batch sending)
  getPendingLogs(): any[] {
    if (!this.isClient) return [];
    
    try {
      return JSON.parse(localStorage.getItem('pending_logs') || '[]');
    } catch {
      return [];
    }
  }

  // Method to clear pending logs after successful send
  clearPendingLogs(): void {
    if (!this.isClient) return;
    localStorage.removeItem('pending_logs');
  }
}

export const logger = Logger.getInstance();

// Convenience exports
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logWarn = (message: string, context?: LogContext) => logger.warn(message, context);
export const logError = (message: string, error?: Error | unknown, context?: LogContext) => 
  logger.error(message, error, context);