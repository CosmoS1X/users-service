import { Router } from 'express';
import { usersController } from '../controllers';

const router = Router();
const controller = usersController();

router.get('/users', controller.findAll);
router.get('/users/:id', controller.findOne);
router.post('/users', controller.create);
router.patch('/users/:id/block', controller.block);
router.delete('/users/:id', controller.delete);

export default router;
