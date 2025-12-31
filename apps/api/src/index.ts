import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from './lib/logger';
import { eventsRoutes } from './routes/events';
import { healthRoutes } from './routes/health';

const app = new Hono();

// Middleware
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
      'http://localhost:5173',
      process.env.FRONTEND_URL || '',
    ].filter(Boolean),
    credentials: true,
  })
);

// Routes
app.route('/health', healthRoutes);
app.route('/api/events', eventsRoutes);

// Root route
app.get('/', (c) => {
  return c.json({
    name: 'Stonefall API',
    version: '0.1.0',
    status: 'running',
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  logger.error({ error: err.message }, 'Unhandled error');
  return c.json({ error: 'Internal Server Error' }, 500);
});

// Start server
const port = Number(process.env.PORT) || 3001;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  try {
    serve({ fetch: app.fetch, port });
    logger.info({ port }, 'Server started');
  } catch (err) {
    logger.error({ error: err }, 'Failed to start server');
  }
}

export default app;
