import { IUserJWT } from '@components/user/user.interface';
import { Request } from 'express';

export interface IRequest extends Request {
  user: IUserJWT;
}
