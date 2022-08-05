import { Router } from 'express';
import walletRoute from './wallet/wallet .routes';

const router = Router();

router.use('/wallet', walletRoute);

router.use('/', async (_req, res, _next) => res.send('Welcome to '));

export default router;
