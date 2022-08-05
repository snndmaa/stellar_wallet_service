import { Router } from 'express';
import swaggerUI from 'swagger-ui-express';
import v1 from './modules/v1';

import doc from './swagger';

const router = Router();

// Controllers
router.use('/docs', swaggerUI.serve, swaggerUI.setup(doc));
router.use('/v1', v1);

router.use('/', (_req, res, _next) =>
  res.send('Welcome to Elink currency management'),
);

router.use('*', (_req, res, _next) =>
  res.send('I can\'t find the resource you\'re looking for'),
);

export default router;
