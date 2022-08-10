import { Router } from 'express';
import {
    currencyList,
    createAcount,
    getWallet,
    deposit,
    withdraw
} from './wallet.controller';

const router = Router();

router.route('/')
    .post(createAcount);

router.route('/stellar')
    .post(deposit)
    .get(currencyList);

router.route('/withdraw')
    .post(withdraw)

router.route('/:userId')
    .get(getWallet);

export default router;
