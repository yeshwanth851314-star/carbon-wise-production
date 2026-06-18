/**
 * Centralized logger for CarbonWise AI.
 * Replaces scattered console calls and prevents internal stack traces 
 * from leaking to users in production.
 */

type LogLevel = 'info' | 'warn' | 'error';

class Logger {
  private log(level: LogLevel, message: string, ...optionalParams: unknown[]) {
    // In a real production app, this could send to Sentry, Datadog, etc.
    if (process.env.NODE_ENV !== 'production') {
      switch (level) {
        case 'info':
          console.log(`[INFO] ${message}`, ...optionalParams);
          break;
        case 'warn':
          console.warn(`[WARN] ${message}`, ...optionalParams);
          break;
        case 'error':
          console.error(`[ERROR] ${message}`, ...optionalParams);
          break;
      }
    } else {
      // Production: Minimal logging, no stack traces exposed to console
      if (level === 'error') {
        console.error(`[ERROR] ${message}`); // Send to monitoring service here
      }
    }
  }

  info(message: string, ...optionalParams: unknown[]) {
    this.log('info', message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: unknown[]) {
    this.log('warn', message, ...optionalParams);
  }

  error(message: string, error?: unknown) {
    // Standardize error logging without leaking raw trace if possible
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.log('error', message, errorMessage);
  }
}

export const logger = new Logger();
