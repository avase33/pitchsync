import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { issueTokenPair, verifyRefreshToken, signAccessToken } from '../services/tokenService.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function validationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ error: 'VALIDATION_ERROR', details: errors.array() });
    return true;
  }
  return false;
}

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async (req, res, next) => {
    try {
      if (validationErrors(req, res)) return;
      const { name, email, password } = req.body;
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ error: 'EMAIL_TAKEN', message: 'Email already registered' });
      const user = await User.create({ name, email, passwordHash: password });
      const tokens = issueTokenPair(user._id);
      res.status(201).json({ user, ...tokens });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  async (req, res, next) => {
    try {
      if (validationErrors(req, res)) return;
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
      }
      const tokens = issueTokenPair(user._id);
      res.json({ user, ...tokens });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/refresh
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'MISSING_TOKEN' });
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ error: 'TOKEN_INVALID', message: err.message });
    }
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'USER_NOT_FOUND' });
    res.json({ accessToken: signAccessToken(user._id) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// PATCH /api/auth/me
router.patch(
  '/me',
  requireAuth,
  [
    body('name').optional().trim().isLength({ min: 1, max: 80 }),
    body('bio').optional().trim().isLength({ max: 200 }),
    body('githubUsername').optional().trim(),
  ],
  async (req, res, next) => {
    try {
      if (validationErrors(req, res)) return;
      const { name, bio, githubUsername } = req.body;
      const update = {};
      if (name !== undefined) update.name = name;
      if (bio !== undefined) update.bio = bio;
      if (githubUsername !== undefined) update.githubUsername = githubUsername;
      const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-passwordHash');
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
