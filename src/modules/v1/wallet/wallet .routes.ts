import { Router } from 'express';
import {
    deposit,
    withdraw,
    getWallet,
    currencyList,
    createAcount,
    uiBalance,
} from './wallet.controller';

const router = Router();

router.route('/')
    .post(createAcount);

router.route('/stellar')
    .post(deposit)
    .get(currencyList);

router.route('/withdraw')
    .post(withdraw)

router.route('/zzz')
    .post(uiBalance)

router.route('/:userId')
    .post(getWallet);



export default router;
