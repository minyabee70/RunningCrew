import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { listAllUsers, updateSubscription } from '../services/userService';
import { getSessionStats } from '../services/sessionService';
import { resolveEffectiveTier, trialDaysLeft } from '../services/subscriptionService';
import { paramId } from '../utils/params';

const router = Router();

router.use(authenticate, requireRole('creator', 'admin'));

router.get('/users', async (_req, res, next) => {
  try {
    const users = await listAllUsers();
    res.json(
      users.map((u) => ({
        ...u,
        effectiveTier: resolveEffectiveTier(u),
        trialDaysLeft: trialDaysLeft(u),
      }))
    );
  } catch (err) {
    next(err);
  }
});

router.patch('/users/:userId/subscription', async (req, res, next) => {
  try {
    const { status, expires_at } = req.body;
    if (!status) return res.status(400).json({ error: 'status required' });
    const user = await updateSubscription(paramId(req.params.userId), status, expires_at);
    res.json({
      ...user,
      effectiveTier: resolveEffectiveTier(user),
      trialDaysLeft: trialDaysLeft(user),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/stats', async (_req, res, next) => {
  try {
    const stats = await getSessionStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
