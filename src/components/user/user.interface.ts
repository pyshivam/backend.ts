export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  country: string;
  phone: string;
  username: string;
  isVerified: boolean;
}

export interface IUserJWT {
  id: string;
  username: string;
}

export interface IUserVerify extends IUserJWT {
  code: string;
}
