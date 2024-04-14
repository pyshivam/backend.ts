import consts from '@config/consts';
import bcrypt from 'bcrypt';

export const createHash = async (data: string): Promise<string> => {
  return bcrypt.hash(data, consts.SALT_ROUNDS);
};

export const compareHash = async (
  data: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(data, hash);
};
