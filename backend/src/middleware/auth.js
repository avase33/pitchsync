import { verifyAccessToken } from '../services/tokenService.js';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'UNAUTHORIZED', message: 'No token provided' });

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID';
      return res.status(401).json({ error: code, message: err.message });
    }

    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) return res.status(401).json({ error: 'USER_NOT_FOUND', message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    User.findById(payload.sub)
      .select('-passwordHash')
      .then((user) => {
        if (user) req.user = user;
        next();
      })
      .catch(() => next());
  } catch {
    next();
  }
}
