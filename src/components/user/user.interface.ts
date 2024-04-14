export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  country: string;
  phone: string;
  username: string;
}

export interface IUserJWT {
  _id: string;
  email: string;
  username: string;
}
