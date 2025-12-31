/**
 * Logger Configuration
 * Structured logging with Pino
 */
import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

// Child loggers for specific contexts
export const geminiLogger = logger.child({ service: 'gemini' });
export const eventLogger = logger.child({ service: 'events' });
export const routeLogger = logger.child({ service: 'routes' });
