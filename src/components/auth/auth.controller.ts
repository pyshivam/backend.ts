import { Request, Response } from 'express';
import httpStatus from 'http-status';

import AppError from '@core/utils/appError';
import { verifyEmail, loginUser } from './auth.service';
import { ILoginBody } from './auth.interface';

export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body as ILoginBody;
    const user = await loginUser(body);
    res.status(httpStatus.OK);
    res.send(user);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.httpCode);
      res.send({ message: error.message });
    } else {
      res.status(httpStatus.BAD_REQUEST);
      res.send({ message: 'Something went wrong. please try again!' });
    }
  }
};

export const verify = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    await verifyEmail(token);
    res.status(httpStatus.OK);
    res.send({ message: 'User verified!' });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.httpCode);
      res.send({ message: error.message });
    } else {
      res.status(httpStatus.BAD_REQUEST);
      res.send({ message: 'Something went wrong. please try again!' });
    }
  }
};
