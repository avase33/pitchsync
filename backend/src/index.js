import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import config from './config/index.js';
import authRoutes from './routes/auth.js';
import pitchRoutes from './routes/pitches.js';

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origins,
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' },
  })
);

// Middleware
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pitches', pitchRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    env: config.nodeEnv,
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'NOT_FOUND', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (config.nodeEnv !== 'production') console.error(err);
  res.status(status).json({
    error: err.code || 'INTERNAL_ERROR',
    message: config.nodeEnv !== 'production' ? err.message : 'An error occurred',
  });
});

// Start
async function start() {
  try {
    await mongoose.connect(config.mongo.uri);
    console.log('[db] MongoDB connected');
    const server = app.listen(config.port, () => {
      console.log(`[server] PitchSync API running on port ${config.port} (${config.nodeEnv})`);
    });
    const shutdown = () => {
      server.close(() => {
        mongoose.connection.close();
        process.exit(0);
      });
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('[server] Failed to start:', err);
    process.exit(1);
  }
}

start();
