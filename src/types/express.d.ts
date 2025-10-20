import { User as UserType } from '../models';

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}
