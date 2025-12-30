import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { eventsRoutes } from './routes/events';
import { healthRoutes } from './routes/health';

const app = new Hono();

// Middleware
app.use('*', logger());
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
  console.error('Error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

// Start server
const port = Number(process.env.PORT) || 3001;

// Vercel handles the app via default export, so we only call serve manually for local development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  try {
    serve({
      fetch: app.fetch,
      port,
    });
    console.log(`🚀 Server running on http://localhost:${port}`);
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

export default app;
