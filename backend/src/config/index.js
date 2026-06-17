import dotenv from 'dotenv';
dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),

  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pitchsync',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'pitchsync-dev-secret-change-in-prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'pitchsync-refresh-secret',
    refreshExpiresIn: '30d',
  },

  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:5174').split(','),
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX || '200', 10),
  },

  github: {
    token: process.env.GITHUB_TOKEN || '',
  },
};

export default config;
