/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import pkg from 'mongoose';
import conf from '@config/config';
import { IUserJWT } from '@components/user/user.interface';
import { read } from '@components/user/user.service';

const { Types } = pkg;
const { verify } = jwt;

// eslint-disable-next-line consistent-return
const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  if (token.includes('Bearer'))
    token = req.header('Authorization').replace('Bearer ', '');

  try {
    const user = verify(token, conf.jwtSecretKey) as IUserJWT;
    if (!Types.ObjectId.isValid(user._id))
      return res.status(400).json({ message: 'Invalid token' });

    const exists = await read(user._id).catch((err) => {
      return res.status(500).json({ message: err.message });
    });

    if (!exists) return res.status(400).json({ message: 'Invalid token' });

    // const tokenExists = await Token.exists({
    //   userId: user._id,
    //   status: true,
    // }).catch((err) => {
    //   return res.status(500).json({ message: err.message });
    // });

    // if (!tokenExists) return res.status(401).json({ message: 'Access denied' });

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default checkAuth;
