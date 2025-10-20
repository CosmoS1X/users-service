import type { Request, Response } from 'express';
import { User } from '../models';

export default () => ({
  findAll: async (req: Request, res: Response) => {
    const users = await User.query();

    res.status(200).json(users);
  },
  findOne: async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.query().findById(id);

    if (!user) {
      res.status(404).json({ error: 'UserNotFound', message: `User with ID ${id} not found` });

      return;
    }

    res.status(200).json(user);
  },
  create: async (req: Request, res: Response) => {
    const validData = User.fromJson(req.body);
    const existingUser = await User.query().findOne({ email: validData.email });

    if (existingUser) {
      res.status(409).json({
        error: 'UserAlreadyExists',
        message: `User with email ${validData.email} already exists`,
      });

      return;
    }

    const newUser = await User.query().insert(validData);

    res.status(201).json(newUser);
  },
  block: async (req: Request, res: Response) => {
    const { id } = req.params;
    const userToBlock = await User.query().findById(id);

    if (!userToBlock) {
      res.status(404).json({ error: 'UserNotFound', message: `User with ID ${id} not found` });

      return;
    }

    await userToBlock.$query().patch({ isActive: false });

    res.status(200).json(userToBlock);
  },
  delete: async (req: Request, res: Response) => {
    const { id } = req.params;
    const userToDelete = await User.query().findById(id);

    if (!userToDelete) {
      res.status(404).json({
        error: 'UserNotFound',
        message: `User with ID ${id} not found or already deleted`,
      });

      return;
    }

    await userToDelete.$query().deleteById(id);

    res.status(204).end();
  },
});
