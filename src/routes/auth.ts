import { Router } from 'express';
import { authController } from '../controllers';

const router = Router();
const controller = authController();

router.post('/login', controller.login);
router.get('/check-auth', controller.checkAuth);
router.post('/logout', controller.logout);

export default router;
