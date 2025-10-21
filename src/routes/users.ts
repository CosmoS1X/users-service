import { Router } from 'express';
import { usersController } from '../controllers';
import { adminAccessGuard, ownerOrAdminAccessGuard } from '../middlewares/auth';

const router = Router();
const controller = usersController();

router.get('/users', adminAccessGuard, controller.findAll);
router.get('/users/:id', ownerOrAdminAccessGuard, controller.findOne);
router.post('/users', controller.create);
router.patch('/users/:id/block', ownerOrAdminAccessGuard, controller.block);

export default router;
