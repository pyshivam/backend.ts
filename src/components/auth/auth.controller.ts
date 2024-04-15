import { Request, Response } from 'express';
import httpStatus from 'http-status';

import AppError from '@core/utils/appError';
import loginUser from './auth.service';
import { ILoginBody } from './auth.interface';

const login = async (req: Request, res: Response) => {
  try {
    const body = req.body as ILoginBody;
    const user = await loginUser(body);
    res.status(httpStatus.OK);
    res.send(user);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.httpCode);
      res.send({ message: error.message });
    }
    res.status(httpStatus.BAD_REQUEST);
    res.send({ message: 'Something went wrong. please try again!' });
  }
};

export default login;
