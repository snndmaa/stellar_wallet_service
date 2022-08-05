import { Wallet } from '../../../database';
import { IWallet } from '../../../types';
import { catchError } from '../../common/utils';

class WalletService {
    userId: string;
    constructor(userId = "") {
        this.userId = userId;
    }

    public async createWallet(params: Partial<IWallet>) {
        const wallet = new Wallet(params);
        await wallet.save();
        return wallet;
    }

    public async getWallet() {
        return await Wallet.findOne().where('userId').equals(this.userId).catch(e => {
            throw catchError(e, 400)
        });
    }
}

export default WalletService;
