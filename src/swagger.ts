import { config } from 'dotenv';
import ProductDocs from './modules/v1/product/product.docs';

config();

const { PORT, BACKEND_URL } = process.env;

const doc = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Elink Product Management Service API',
    description: 'An Application to manage elink products',
  },
  host: BACKEND_URL || `localhost:${PORT}/`,
  basePath: '/',
  tags: [
    // Add tags here
    'Product',
  ],
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    // Add docs here
    ...ProductDocs,
  },
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      in: 'header',
      description: `Add token for authorization using the format Bearer (token)e.g.
        'Bearer eetelteouou1223424nkdnkdgndkg'`,
      name: 'Authorization',
    },
  },
  definitions: {},
};

export default doc;
