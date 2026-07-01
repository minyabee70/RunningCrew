import { Router } from 'express';
import { authenticate, requireFeature } from '../middleware/auth';
import * as sessionService from '../services/sessionService';
import { enrichRoutePoints } from '../services/metricsService';
import { NotFoundError } from '../errors/AppError';
import { paramId } from '../utils/params';

const router = Router();

router.get('/sessions/:id/metrics', authenticate, async (req, res, next) => {
  try {
    const session = await sessionService.getSessionById(paramId(req.params.id), req.user!.userId);
    if (!session) throw new NotFoundError('Session not found');
    const data = enrichRoutePoints(session.route_points);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/users/:userId/sessions', authenticate, async (req, res, next) => {
  try {
    if (req.params.userId !== req.user!.userId && req.user!.role !== 'creator' && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const sessions = await sessionService.listSessionsByUser(paramId(req.params.userId), {
      status: req.query.status as string | undefined,
      from: req.query.from as string | undefined,
      to: req.query.to as string | undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    res.json(sessions);
  } catch (err) {
    next(err);
  }
});

router.get('/users/:userId/analytics/trends', authenticate, requireFeature('history_basic'), async (req, res, next) => {
  try {
    const userId = paramId(req.params.userId);
    if (userId !== req.user!.userId && req.user!.role !== 'creator' && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const sessions = await sessionService.listSessionsByUser(userId, {
      status: 'completed',
      from: req.query.from as string | undefined,
      to: req.query.to as string | undefined,
      limit: req.query.limit ? Number(req.query.limit) : 100,
    });
    const totalDistance = sessions.reduce((s, x) => s + Number(x.distance_meters), 0);
    const totalDuration = sessions.reduce((s, x) => s + Number(x.duration_seconds), 0);
    const avgPace =
      sessions.length > 0
        ? sessions.reduce((s, x) => s + Number(x.avg_pace_sec_per_km ?? 0), 0) / sessions.length
        : 0;
    res.json({
      sessionCount: sessions.length,
      totalDistanceMeters: totalDistance,
      totalDurationSeconds: totalDuration,
      avgPaceSecPerKm: avgPace,
      sessions: sessions.map((s) => ({
        id: s.id,
        started_at: s.started_at,
        distance_meters: s.distance_meters,
        avg_pace_sec_per_km: s.avg_pace_sec_per_km,
        duration_seconds: s.duration_seconds,
        calories: s.calories,
      })),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
