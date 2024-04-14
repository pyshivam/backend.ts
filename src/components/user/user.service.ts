import httpStatus from 'http-status';
import AppError from '@core/utils/appError';
import logger from '@core/utils/logger';
import { UserModel } from '@components/user/user.model';
import { IUser } from '@components/user/user.interface';
import { createHash } from '@core/utils/hashing';

const create = async (user: IUser): Promise<boolean> => {
  try {
    const doc = await UserModel.findOne({ email: user.email });
    if (doc) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User already exists!');
    }

    const unDoc = await UserModel.findOne({ username: user.username });
    if (unDoc) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Username already exists!');
    }

    const password = await createHash(user.password);

    const newUser = await UserModel.create({ ...user, password });
    logger.debug(`User created: %O`, newUser);
    return true;
  } catch (err) {
    logger.error(`User create err: %O`, err.message);
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError(httpStatus.BAD_REQUEST, 'User was not created!');
  }
};

const read = async (id: string): Promise<IUser> => {
  logger.debug(`Sent user.id ${id}`);
  const user = await UserModel.findOne({ _id: id });
  return user as IUser;
};

const update = async (user: IUser): Promise<boolean> => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: user.email },
      { name: user.name },
      { new: true },
    );
    logger.debug(`User updated: %O`, updatedUser);
    return true;
  } catch (err) {
    logger.error(`User update err: %O`, err.message);
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError(httpStatus.BAD_REQUEST, 'User was not updated!');
  }
};

const deleteById = async (id: string): Promise<boolean> => {
  await UserModel.findByIdAndDelete(id);
  logger.debug(`User ${id} has been removed`);
  return true;
};

export { create, read, update, deleteById };