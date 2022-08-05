// @ts-ignore
import { boolean, string } from '../../../swaggerTypes';

export default {
  'v1/product': {
    post: {
      tags: ['Product'],
      summary: 'Add new product',
      description: 'Add a new product for elink',
      requestBody: {
        Content: 'application/json',
      },
      parameters: [
        {
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            properties: {
                url: string,
                name: string,
                description: string,
            },
          },
        },
      ],
      responses: {
        200: {
          description: 'Successful',
          schema: {
            type: 'object',
            properties: {
              status: boolean,
              message: string,
              data: {
                type: 'object',
                properties: {
                  _id: string,
                  url: string,
                  name: string,
                  createdAt: string,
                  updatedAt: string,
                  description: string,
                },
              },
            },
          },
        },
        400: {
          description: 'Failed',
          schema: {
            type: 'object',
            properties: {
              status: false,
              message: string,
              data: null,
            },
          },
        },
      },
    },
  },
  'v1/product/': {
    get: {
        tags: ['Product'],
        summary: 'Get all products',
        description: 'Get all products on system',
      responses: {
        200: {
          description: 'Successful',
          schema: {
            type: 'object',
            properties: {
              status: boolean,
              message: string,
              data: {
                type: 'object',
                properties: [{
                    _id: string,
                    url: string,
                    name: string,
                    createdAt: string,
                    updatedAt: string,
                    description: string,
                }],
              },
            },
          },
        },
        400: {
          description: 'Failed',
          schema: {
            type: 'object',
            properties: {
              status: boolean,
              message: string,
              data: null,
            },
          },
        },
      },
    },
  },
  'v1/product/{id}': {
    get: {
      tags: ['Product'],
      summary: 'Get specific product information',
      description: 'Get specific product information with product id',
      requestBody: {
        Content: 'application/json',
      },
      parameters: [
        {
            in: 'path',
            name: 'id',
            required: true,
          },
      ],
      responses: {
        200: {
          description: 'Successful',
          schema: {
            type: 'object',
            properties: {
              status: boolean,
              message: string,
              data: {
                type: 'object',
                properties: {
                    _id: string,
                    url: string,
                    name: string,
                    createdAt: string,
                    updatedAt: string,
                    description: string,
                },
              },
            },
          },
        },
        400: {
          description: 'Failed',
          schema: {
            type: 'object',
            properties: {
              status: boolean,
              message: string,
              data: null,
            },
          },
        },
      },
    },
  },
  'v1/product/{id}/': {
    delete: {
      tags: ['Product'],
      summary: 'Delete specific product',
      description: 'Delete specific product information with product id',
      requestBody: {
        Content: 'application/json',
      },
      parameters: [
        {
            in: 'path',
            name: 'id',
            required: true,
          },
      ],
      responses: {
        200: {
          description: 'Successful',
          schema: {
            type: 'object',
            properties: {
              status: boolean,
              message: string,
              data: {
                type: 'object',
                properties: {
                    _id: string,
                    url: string,
                    name: string,
                    createdAt: string,
                    updatedAt: string,
                    description: string,
                },
              },
            },
          },
        },
        400: {
          description: 'Failed',
          schema: {
            type: 'object',
            properties: {
              status: boolean,
              message: string,
              data: null,
            },
          },
        },
      },
    },
  },
  // @ts-ignore
  'v1/product/{id}': {
    put: {
      tags: ['Product'],
      summary: 'Update product information',
      description: 'Update specific product information',
      requestBody: {
        Content: 'application/json',
      },
      parameters: [
        {
          in: 'body',
          name: 'body',
          schema: {
            type: 'object',
            properties: {
                url: string,
                name: string,
                description: string,
            },
          },
        },
        {
            in: 'path',
            name: 'id',
        },
      ],
      responses: {
        200: {
          description: 'Successful',
          schema: {
            type: 'object',
            properties: {
              status: boolean,
              message: string,
              data: {
                type: 'object',
                properties: {
                    _id: string,
                    url: string,
                    name: string,
                    createdAt: string,
                    updatedAt: string,
                    description: string,
                },
              },
            },
          },
        },
        400: {
          description: 'Failed',
          schema: {
            type: 'object',
            properties: {
              status: boolean,
              message: string,
              data: null,
            },
          },
        },
      },
    },
  },
};
