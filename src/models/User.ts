import type { JSONSchema } from 'objection';
import { Model } from '../database';
import { encrypt } from '../lib/secure';

export class User extends Model {
  id!: number;

  fullName!: string;

  birthDate!: Date | null;

  email!: string;

  passwordDigest!: string;

  role!: 'user' | 'admin';

  isActive!: boolean;

  createdAt!: Date;

  static get tableName() {
    return 'users';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['fullName', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        fullName: { type: 'string', minLength: 3, maxLength: 255 },
        birthDate: { type: ['string', 'null'], format: 'date' },
        email: { type: 'string', format: 'email', maxLength: 255 },
        password: { type: 'string', minLength: 5, maxLength: 255 },
        role: { type: 'string', enum: ['user', 'admin'] },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  set password(password: string) {
    this.passwordDigest = encrypt(password);
  }

  verifyPassword(password: string) {
    return encrypt(password) === this.passwordDigest;
  }
}
