import type { Request, Response, NextFunction } from 'express';
import passport from '../lib/passport';
import { User } from '../models';

export default () => ({
  login: (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (error: Error, user: User, info: { message: string }) => {
      if (error) {
        next(error);
        return;
      }

      if (!user) {
        res.status(401).json({ message: info.message });
        return;
      }

      req.logIn(user, (err) => {
        if (err) {
          next(err);
          return;
        }

        res.status(200).json(user);
      });
    })(req, res, next);
  },
  checkAuth: (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
      return;
    }

    res.status(401).json({ message: 'Not authenticated' });
  },
  logout: (req: Request, res: Response) => {
    req.logOut((error) => {
      if (error) {
        res.status(500).json({ message: 'Logout failed', error });
        return;
      }

      req.session.destroy(() => {
        res.clearCookie('connect.sid', {
          path: '/',
          httpOnly: true,
        });

        res.status(204).end();
      });
    });
  },
});
