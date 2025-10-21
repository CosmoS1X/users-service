import type { Request, Response, NextFunction } from 'express';

const forbiddenError = { error: 'Forbidden', message: 'Access denied' };

export const adminAccessGuard = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  const isAdmin = user?.role === 'admin';

  if (isAdmin) {
    return next();
  }

  return res.status(403).json(forbiddenError);
};

export const ownerOrAdminAccessGuard = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.id === Number(req.params.id);

  if (isAdmin || isOwner) {
    return next();
  }

  return res.status(403).json(forbiddenError);
};
