import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import { nanoid } from 'nanoid';
import Pitch from '../models/Pitch.js';
import User from '../models/User.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { fetchRepoData } from '../services/githubService.js';
import { analyzeRepo } from '../services/analyzerService.js';
import { generateSlides } from '../services/slideGenerator.js';

const router = Router();

function vErr(req, res) {
  const e = validationResult(req);
  if (!e.isEmpty()) { res.status(422).json({ error: 'VALIDATION_ERROR', details: e.array() }); return true; }
  return false;
}

// GET /api/pitches — list my pitches
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(20, parseInt(req.query.limit || '10'));
    const skip = (page - 1) * limit;
    const q = req.query.q ? { $text: { $search: req.query.q } } : {};
    const filter = { owner: req.user._id, ...q };
    const [pitches, total] = await Promise.all([
      Pitch.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Pitch.countDocuments(filter),
    ]);
    res.json({ pitches, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// GET /api/pitches/public — explore page
router.get('/public', optionalAuth, async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(20, parseInt(req.query.limit || '12'));
    const skip = (page - 1) * limit;
    const [pitches, total] = await Promise.all([
      Pitch.find({ isPublic: true, status: 'ready' })
        .sort({ likes: -1, views: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('owner', 'name initials avatar')
        .lean(),
      Pitch.countDocuments({ isPublic: true, status: 'ready' }),
    ]);
    res.json({ pitches, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// POST /api/pitches — generate a new pitch from repo URL
router.post(
  '/',
  requireAuth,
  [
    body('repoUrl').notEmpty().withMessage('repoUrl is required'),
    body('theme').optional().isIn(['dark', 'light', 'ocean', 'forest', 'sunset']),
    body('isPublic').optional().isBoolean(),
  ],
  async (req, res, next) => {
    try {
      if (vErr(req, res)) return;
      const { repoUrl, theme = 'dark', isPublic = false } = req.body;

      // Create stub record — status: generating
      const pitch = await Pitch.create({
        owner: req.user._id,
        title: 'Generating...',
        repoUrl,
        theme,
        isPublic,
        status: 'generating',
        slug: nanoid(10),
      });

      res.status(202).json({ pitch });

      // Generate asynchronously
      setImmediate(async () => {
        try {
          const repoData = await fetchRepoData(repoUrl);
          const analysis = analyzeRepo(repoData);
          const slides = generateSlides(analysis);

          await Pitch.findByIdAndUpdate(pitch._id, {
            title: analysis.name,
            tagline: analysis.tagline,
            repoMeta: analysis.repoMeta,
            slides,
            status: 'ready',
          });

          // Increment user pitch count
          await User.findByIdAndUpdate(req.user._id, { $inc: { pitchCount: 1 } });
        } catch (err) {
          await Pitch.findByIdAndUpdate(pitch._id, {
            title: repoUrl,
            status: 'error',
          });
        }
      });
    } catch (err) { next(err); }
  }
);

// GET /api/pitches/:id — get single pitch
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const pitch = await Pitch.findById(req.params.id)
      .populate('owner', 'name initials avatar githubUsername')
      .lean();
    if (!pitch) return res.status(404).json({ error: 'NOT_FOUND' });
    if (!pitch.isPublic && (!req.user || String(pitch.owner._id) !== String(req.user._id))) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    // Increment views (fire-and-forget)
    Pitch.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();
    res.json({ pitch });
  } catch (err) { next(err); }
});

// GET /api/pitches/slug/:slug — get by slug (public share link)
router.get('/slug/:slug', optionalAuth, async (req, res, next) => {
  try {
    const pitch = await Pitch.findOne({ slug: req.params.slug })
      .populate('owner', 'name initials avatar')
      .lean();
    if (!pitch) return res.status(404).json({ error: 'NOT_FOUND' });
    if (!pitch.isPublic && (!req.user || String(pitch.owner._id) !== String(req.user._id))) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    Pitch.findByIdAndUpdate(pitch._id, { $inc: { views: 1 } }).exec();
    res.json({ pitch });
  } catch (err) { next(err); }
});

// PATCH /api/pitches/:id — update pitch metadata or slides
router.patch(
  '/:id',
  requireAuth,
  [
    body('title').optional().trim().isLength({ min: 1, max: 120 }),
    body('tagline').optional().trim().isLength({ max: 200 }),
    body('theme').optional().isIn(['dark', 'light', 'ocean', 'forest', 'sunset']),
    body('isPublic').optional().isBoolean(),
    body('slides').optional().isArray(),
  ],
  async (req, res, next) => {
    try {
      if (vErr(req, res)) return;
      const pitch = await Pitch.findOne({ _id: req.params.id, owner: req.user._id });
      if (!pitch) return res.status(404).json({ error: 'NOT_FOUND' });
      const { title, tagline, theme, isPublic, slides } = req.body;
      const update = {};
      if (title !== undefined) update.title = title;
      if (tagline !== undefined) update.tagline = tagline;
      if (theme !== undefined) update.theme = theme;
      if (isPublic !== undefined) update.isPublic = isPublic;
      if (slides !== undefined) update.slides = slides;
      const updated = await Pitch.findByIdAndUpdate(pitch._id, update, { new: true });
      res.json({ pitch: updated });
    } catch (err) { next(err); }
  }
);

// DELETE /api/pitches/:id
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const pitch = await Pitch.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!pitch) return res.status(404).json({ error: 'NOT_FOUND' });
    await User.findByIdAndUpdate(req.user._id, { $inc: { pitchCount: -1 } });
    res.json({ success: true });
  } catch (err) { next(err); }
});

// POST /api/pitches/:id/like
router.post('/:id/like', optionalAuth, async (req, res, next) => {
  try {
    const pitch = await Pitch.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!pitch) return res.status(404).json({ error: 'NOT_FOUND' });
    res.json({ likes: pitch.likes });
  } catch (err) { next(err); }
});

// POST /api/pitches/:id/regenerate — re-fetch and regenerate slides
router.post('/:id/regenerate', requireAuth, async (req, res, next) => {
  try {
    const pitch = await Pitch.findOne({ _id: req.params.id, owner: req.user._id });
    if (!pitch) return res.status(404).json({ error: 'NOT_FOUND' });
    await Pitch.findByIdAndUpdate(pitch._id, { status: 'generating' });
    res.json({ success: true, message: 'Regenerating pitch...' });
    setImmediate(async () => {
      try {
        const repoData = await fetchRepoData(pitch.repoUrl);
        const analysis = analyzeRepo(repoData);
        const slides = generateSlides(analysis);
        await Pitch.findByIdAndUpdate(pitch._id, {
          title: analysis.name,
          tagline: analysis.tagline,
          repoMeta: analysis.repoMeta,
          slides,
          status: 'ready',
        });
      } catch {
        await Pitch.findByIdAndUpdate(pitch._id, { status: 'error' });
      }
    });
  } catch (err) { next(err); }
});

export default router;
