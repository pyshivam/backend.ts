import pkg from 'jsonwebtoken';
import conf from '@config/config';
import { IUserJWT } from '@components/user/user.interface';

const { sign } = pkg;

export function signAccessToken(user: IUserJWT) {
  const accessToken = sign(user, conf.jwtSecretKey, {
    expiresIn: '1h',
  });
  return accessToken;
}
export function signRefreshToken(user: IUserJWT) {
  const refreshToken = sign(user, conf.refreshTokenSecretKey, {
    expiresIn: '7d',
  });
  return refreshToken;
}
export function signConfirmCodeToken(user: IUserJWT, confirmCode: any) {
  const confirmCodeToken = sign(
    { ...user, code: confirmCode },
    conf.jwtSecretKey,
    {
      expiresIn: '5m',
    },
  );
  return confirmCodeToken;
}
