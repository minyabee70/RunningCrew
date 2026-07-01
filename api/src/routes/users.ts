import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { findById, updateSettings, updateBiometrics } from '../services/userService';
import { resolveEffectiveTier, trialDaysLeft } from '../services/subscriptionService';
import { NotFoundError } from '../errors/AppError';

const router = Router();

router.get('/:userId/settings', authenticate, async (req, res, next) => {
  try {
    if (req.params.userId !== req.user!.userId) return res.status(403).json({ error: 'Forbidden' });
    const user = await findById(req.params.userId);
    if (!user) throw new NotFoundError('User not found');
    res.json({
      language: user.language,
      ui_theme: user.ui_theme,
      font_scale: user.font_scale,
      height_cm: user.height_cm,
      weight_kg: user.weight_kg,
      effectiveTier: resolveEffectiveTier(user),
      trialDaysLeft: trialDaysLeft(user),
      subscription_status: user.subscription_status,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
});

router.patch('/:userId/settings', authenticate, async (req, res, next) => {
  try {
    if (req.params.userId !== req.user!.userId) return res.status(403).json({ error: 'Forbidden' });
    const user = await updateSettings(req.params.userId, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.patch('/:userId/biometrics', authenticate, async (req, res, next) => {
  try {
    if (req.params.userId !== req.user!.userId) return res.status(403).json({ error: 'Forbidden' });
    const user = await updateBiometrics(req.params.userId, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
