import { Hono } from 'hono';

export const healthRoutes = new Hono();

healthRoutes.get('/', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

healthRoutes.get('/ready', (c) => {
  // Add any readiness checks here (database connection, etc.)
  return c.json({
    ready: true,
    services: {
      api: true,
      // database: false, // Future: check DB connection
      // ai: false,       // Future: check AI service
    },
  });
});
