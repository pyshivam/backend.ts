/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import httpStatus from 'http-status';
import AppError from '@core/utils/appError';
import logger from '@core/utils/logger';
import { UserModel } from '@components/user/user.model';
import { IUser } from '@components/user/user.interface';
import { createHash } from '@core/utils/authHelper';
import sendVerificationEmail from '@core/utils/sendEmail';
import generateRandomCode from '@core/utils/generateRandomCode';
import { signConfirmCodeToken } from '@core/utils/jwtTokenHelper';

const create = async (user: IUser): Promise<boolean> => {
  try {
    // TODO: here we can improve this by using a single query to check if the user exists as well as the username

    const doc = await UserModel.findOne({ email: user.email });
    if (doc) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User already exists!');
    }

    const unDoc = await UserModel.findOne({ username: user.username });
    if (unDoc) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Username already exists!');
    }

    const password = await createHash(user.password);

    const newUser = await UserModel.create({
      ...user,
      password,
      isVerified: false,
    });

    await sendVerificationEmail(
      user.email,
      signConfirmCodeToken(
        { username: user.username, id: newUser._id },
        generateRandomCode(6),
      ),
    );
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
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  user.password = undefined;
  return user as IUser;
};

const update = async (user: IUser) => {
  try {
    const { username } = user;
    delete user.username;
    if (user.password) {
      user.password = await createHash(user.password);
    }
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      { ...user },
      { new: true },
    );
    logger.debug(`User updated: %O`, updatedUser);
    updatedUser.password = undefined;
    updatedUser.__v = undefined;
    return updatedUser;
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
