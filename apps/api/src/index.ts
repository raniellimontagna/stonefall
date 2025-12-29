import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { healthRoutes } from './routes/health';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  })
);

// Routes
app.route('/health', healthRoutes);

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

serve({
  fetch: app.fetch,
  port,
});

console.log(`🚀 Server running on http://localhost:${port}`);
