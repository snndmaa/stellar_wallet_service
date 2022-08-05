import { Router } from 'express';
import {
    currencyList,
    createAcount,
    getWallet,
    deposit,
} from './wallet.controller';

const router = Router();

router.route('/')
    .post(createAcount);

router.route('/stellar')
    .post(deposit)
    .get(currencyList);

router.route('/:userId')
    .get(getWallet);

export default router;
