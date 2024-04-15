/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  create,
  read,
  update,
  deleteById,
} from '@components/user/user.service';
import { IUser } from '@components/user/user.interface';
import { IRequest } from '@core/interfaces/express';
import AppError from '@core/utils/appError';

const createUser = async (req: Request, res: Response) => {
  const user = req.body as IUser;
  try {
    await create(user);
    res.status(httpStatus.CREATED);
    res.send({ message: 'Created' });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST);
    res.send({ message: error.message });
  }
};

const readUser = async (req: IRequest, res: Response) => {
  try {
    const user = (await read(req.user.id)) as IUser;
    res.status(httpStatus.OK);
    res.send({ message: 'user detailes fetched!', user });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.httpCode || httpStatus.BAD_REQUEST);
      res.send({ message: error.message });
    }
    res.status(httpStatus.BAD_REQUEST);
    res.send({ message: 'Something went wrong. please try again!' });
  }
};

const updateUser = async (req: IRequest, res: Response) => {
  const user = req.body as IUser;
  await update(user);
  res.status(httpStatus.OK);
  res.send({ message: 'Updated' });
};

const deleteUser = async (req: IRequest, res: Response) => {
  await deleteById(req.params.email);
  res.status(httpStatus.ACCEPTED);
  res.send({ message: 'Removed' });
};

export { createUser, readUser, updateUser, deleteUser };
