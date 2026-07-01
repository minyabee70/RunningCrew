import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as sessionService from '../services/sessionService';
import { NotFoundError } from '../errors/AppError';
import { paramId } from '../utils/params';

const router = Router();

router.post('/', authenticate, async (req, res, next) => {
  try {
    const session = await sessionService.createSession(req.user!.userId, req.body.started_at);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const session = await sessionService.getSessionById(paramId(req.params.id), req.user!.userId);
    if (!session) throw new NotFoundError('Session not found');
    res.json(session);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    const session = await sessionService.updateSessionMetrics(
      paramId(req.params.id),
      req.user!.userId,
      req.body
    );
    res.json(session);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/points', authenticate, async (req, res, next) => {
  try {
    const session = await sessionService.appendRoutePoints(
      paramId(req.params.id),
      req.user!.userId,
      req.body.points ?? []
    );
    res.json(session);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/complete', authenticate, async (req, res, next) => {
  try {
    const session = await sessionService.completeSession(
      paramId(req.params.id),
      req.user!.userId,
      req.body.ended_at
    );
    res.json(session);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const session = await sessionService.cancelSession(paramId(req.params.id), req.user!.userId);
    res.json(session);
  } catch (err) {
    next(err);
  }
});

export default router;
