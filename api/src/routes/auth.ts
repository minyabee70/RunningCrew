import { Router } from 'express';
import { syncGoogleUser } from '../services/userService';
import { resolveEffectiveTier, trialDaysLeft } from '../services/subscriptionService';

const router = Router();

router.post('/sync', async (req, res, next) => {
  try {
    const { googleId, email, displayName } = req.body;
    if (!googleId || !email) {
      return res.status(400).json({ error: 'googleId and email required' });
    }
    const { user, token } = await syncGoogleUser({
      googleId,
      email,
      displayName: displayName ?? email,
    });
    res.json({
      user: {
        ...user,
        effectiveTier: resolveEffectiveTier(user),
        trialDaysLeft: trialDaysLeft(user),
      },
      token,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
