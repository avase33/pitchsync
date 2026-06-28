// Deck routes -- 2026-06-27 23:11:12
import { Router } from 'express';
import { Deck } from '../models/Deck';
import { analyzeRepo } from '../services/repoAnalyzer';
import { buildDeck } from '../services/slideBuilder';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    const { owner, repo, token, format = 'pptx' } = req.body;
    if (!owner || !repo) return res.status(400).json({ error: 'owner and repo required' });
    const analysis = await analyzeRepo(owner, repo, token);
    const slides = buildDeck(analysis);
    const deck = new Deck({ owner, repo, title: analysis.name, slides, analysis, format });
    await deck.save();
    res.status(201).json({ deckId: deck._id, slideCount: slides.length, analysis: { stars: analysis.stars, language: analysis.language } });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

router.get('/', async (req, res) => {
  const decks = await Deck.find().sort({ createdAt: -1 }).select('-slides -analysis').limit(50);
  res.json({ decks, count: decks.length });
});

router.get('/:id', async (req, res) => {
  const deck = await Deck.findById(req.params.id);
  if (!deck) return res.status(404).json({ error: 'Deck not found' });
  res.json(deck);
});

export default router;