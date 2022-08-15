import { Router } from 'express';
import {
    deposit,
    withdraw,
    getWallet,
    currencyList,
    createAcount,
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
