import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/HttpException';
import { logger } from '@utils/logger';
import { FRONT_END_URL } from '@/config';

export const ErrorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    // 🔥 Log the error
    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`
    );
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || FRONT_END_URL);
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.status(status).json({ message });
  } catch (err) {
    next(err);
  }
};
