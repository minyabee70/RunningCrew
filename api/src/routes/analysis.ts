import { Router } from 'express';
import { authenticate, requireFeature } from '../middleware/auth';
import * as analysisService from '../services/analysisService';
import { NotFoundError } from '../errors/AppError';
import { paramId } from '../utils/params';

const router = Router();

router.post('/:sessionId/analyze', authenticate, requireFeature('analysis_advanced'), async (req, res, next) => {
  try {
    const force = req.query.force === 'true';
    const analysis = await analysisService.analyzeSession(paramId(req.params.sessionId), { force });
    res.json(analysis);
  } catch (err) {
    next(err);
  }
});

router.get('/:sessionId/analysis', authenticate, async (req, res, next) => {
  try {
    const analysis = await analysisService.getLatestAnalysis(paramId(req.params.sessionId));
    if (!analysis) throw new NotFoundError('Analysis not found');
    res.json({ ...analysis, cached: true });
  } catch (err) {
    next(err);
  }
});

export default router;
