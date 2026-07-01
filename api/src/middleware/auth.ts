import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';
import { findById, verifyToken } from '../services/userService';
import {
  canAccessFeature,
  resolveEffectiveTier,
  type FeatureKey,
} from '../services/subscriptionService';

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing authorization token');
    }
    const token = header.slice(7);
    const payload = verifyToken(token);
    const user = await findById(payload.userId);
    if (!user) throw new UnauthorizedError('User not found');

    const effectiveTier = resolveEffectiveTier(user);
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      effectiveTier,
    };
    next();
  } catch (err) {
    if (err instanceof UnauthorizedError) return next(err);
    next(new UnauthorizedError('Invalid token'));
  }
}

export function requireFeature(feature: FeatureKey) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError('Not authenticated'));
    if (!canAccessFeature(req.user.effectiveTier, feature)) {
      return next(new ForbiddenError(`Feature '${feature}' requires a higher subscription tier`));
    }
    next();
  };
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError('Not authenticated'));
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient role'));
    }
    next();
  };
}
