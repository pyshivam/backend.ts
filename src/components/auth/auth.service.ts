import httpStatus from 'http-status';
import AppError from '@core/utils/appError';
import logger from '@core/utils/logger';
import { UserModel } from '@components/user/user.model';
import { comparePassword } from '@core/utils/authHelper';
import { signAccessToken, signRefreshToken } from '@core/utils/jwtTokenHelper';
import { IUserJWT, IUserVerify } from '@components/user/user.interface';
import config from '@config/config';
import { verify } from 'jsonwebtoken';
import { ILoginBody } from './auth.interface';

export const loginUser = async (body: ILoginBody) => {
  try {
    const user = await UserModel.findOne({ email: body.email });
    if (user) {
      const isMatch = await comparePassword(body.password, user.password);
      if (isMatch) {
        // eslint-disable-next-line no-underscore-dangle
        const u = { username: user.username, id: user._id } as IUserJWT;
        const accessToken = signAccessToken(u);
        const refreshToken = signRefreshToken(u);
        user.password = undefined;
        return { tokens: { accessToken, refreshToken }, user };
      }
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid credentials');
    }
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  } catch (error) {
    logger.error(`User login error: %O`, error.message);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};

export const verifyEmail = async (token: string) => {
  try {
    if (!token) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid token');
    }

    let user: IUserVerify;

    try {
      user = verify(token, config.jwtSecretKey) as IUserVerify;
    } catch (error) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid token');
    }

    const u = await UserModel.findOne({ _id: user.id });
    if (!u) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
    }

    if (u.isVerified) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User already verified');
    }

    u.isVerified = true;
    await u.save();
    return { message: 'User verified!' };
  } catch (error) {
    logger.error(`User verification error: %O`, error.message);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};
