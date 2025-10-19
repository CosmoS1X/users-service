import type { Request, Response, NextFunction } from 'express';
import {
  ValidationError,
  NotNullViolationError,
  UniqueViolationError,
  ForeignKeyViolationError,
} from 'objection';

export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.error('Error handler middleware:', error);
  }

  let status: number;
  let message: string;

  switch (error.constructor) {
    case ValidationError:
      status = 400;
      message = error.message;
      break;
    case NotNullViolationError:
      status = 400;
      message = 'A required field is missing';
      break;
    case UniqueViolationError:
      status = 409;
      message = 'Duplicate entry violates unique constraint';
      break;
    case ForeignKeyViolationError:
      status = 409;
      message = 'Referenced resource is in use by other records or does not exist';
      break;
    default:
      status = 500;
      message = 'Something went wrong';
  }

  res.status(status).json({ error: error.name, message }).end();
};
