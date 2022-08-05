import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import routes from './routes';
import './database/connection';
import { errorHandler } from './modules/common/utils';

const app = express();
const { PORT, NODE_ENV } = process.env;

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many request from this IP, please try again after 10 minutes',
});

// Middlewares
app.use(helmet());
app.use(compression());
app.use('/static', express.static('public'));

app.use(
  cors({
    origin: (_origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.disable('x-powered-by');

app.use('/', apiLimiter, routes);

// Error handlers
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Environment is ${NODE_ENV}`);
  console.log(`Server started on port: ${PORT}`);
  console.log(`Connected to database: ${process.env.DB_NAME}`);
});

export default app;
