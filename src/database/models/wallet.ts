import { Schema } from 'mongoose';
import { db } from '../connection';
import { IWallet } from '../../types';

const WalletSchema: Schema = new Schema<IWallet>(
  {
    userId: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    usdBalance: {
        type: String,
        trim: true,
    },
    pinCode: {
        type: String,
        trim: true,
    },
    publicKey: {
        type: String,
    },
    secretKey: {
      type: String,
    },
    stellarBalance: {
        type: String,
        trim: true,
    },
    deletedAt: {
      type: String,
    },
  },
  {
    collection: 'wallets',
    versionKey: false,
  },
);

WalletSchema.set('timestamps', true);

export default db.model<IWallet>('Wallet', WalletSchema);
