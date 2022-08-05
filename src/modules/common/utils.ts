import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';

import { AppError, CreateErr, AuthenticatedRequest } from '../../types';

export const catchError: CreateErr = (message, code = 403, validations = null) => {
  const err = new Error(message);
  // @ts-ignore
  err.code = code;
  // @ts-ignore
  err.validations = validations;
  return err;
};

export const success = (msg: string, data: any, meta?: object) => ({
  data,
  status: true,
  message: msg,
  ...(meta && { meta }),
});

export function errorHandler(error: AppError, req: any, res: Response, _next: any) {
  try {
    if (error.validations) {
      return res.status(422).json({
        status: false,
        message: error.validations,
      });
    }

    const code = error.code || 500;
    const msg = error.message;

    console.log(error.name || 'Error', error.message);

    return res.status(code || 500).json({ status: false, message: msg });
  } catch (e) {
    return res.status(500).json({ status: false });
  }
}

export const forwardRequest = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { app } = req;
  // eslint-disable-next-line no-underscore-dangle
  return app._router.handle(req, res, next);
};

export const validate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array({ onlyFirstError: true });

    throw catchError('Validation failed', 400, extractedErrors[0].msg);
  } catch (e) {
    return next(e);
  }
};
