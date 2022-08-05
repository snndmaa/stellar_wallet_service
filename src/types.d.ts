import { Request } from 'express';

interface DefaultAttributes {
  _id?: string;
  deletedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface IWallet extends DefaultAttributes {
  userId: string;
  pinCode: string;
  lastName: string;
  firstName: string;
  usdBalance: string;
  stellarBalance: string;
  publicKey: string;
  secretKey: string;
}

interface IUserDetails {
  email: string;
  first_name: string;
  last_name: string;
}

interface IAccountDetails {
  user?: string;
  memo: string;
  account: string;
  muxed_account: string;
}

type CreateErr = (message: string, code?: number, validations?: object) => Error;

type AuthenticatedRequest = Request & {
  destination?: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
  };
};

type AppError = Error & {
  code: number;
  name?: string;
  message: string;
  validations?: object | null;
};

type Fix = any;
