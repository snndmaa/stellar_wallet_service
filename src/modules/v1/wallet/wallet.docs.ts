import { boolean, string, number } from '../../../swaggerTypes';

export default {
  'v1/wallet': {
    post: {
      tags: ['Wallet'],
      summary: 'Create wallet account',
      description: 'Create wallet account',
      requestBody: {
        Content: 'application/json',
        Authorization: 'Bearer {token}',
      },
      parameters: [
        {
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            properties: {
              userId: string,
              pinCode: string,
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
                  publicKey: string,
                  secretKey: string,
                  "_wallet": {
                    _id: string,
                    userId: string,
                    pinCode: string,
                    publicKey: string,
                    secretKey: string,
                    createdAt: string,
                    updatedAt: string,
                    usdBalance: string,
                    stellarBalance: string,
                  },
                  "_account": {},
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
  'v1/stellar': {
    post: {
      tags: ['Wallet'],
      summary: 'Deposit cash',
      description: 'Deposit cash for customer',
      requestBody: {
        Content: 'application/json',
        Authorization: 'Bearer {token}',
      },
      parameters: [
        {
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            properties: {
              email: string,
              userId: string,
              issuer: string,
              amount: string,
              pinCode: string,
              currency: string,
              first_name: string,
              last_name: string,
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
                  wallet: {},

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
  'v1/wallet/stellar': {
    get: {
      tags: ['Wallet'],
      summary: 'Get All Currencies Assets',
      description: 'Get All Anchor assets',
      requestBody: {
        Content: 'application/json',
        Authorization: 'Bearer {token}',
      },
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
                  currencies: [
                    {
                        code: string,
                        issuer: string,
                        status: string,
                        display_decimals: number,
                        name: string,
                        desc: string,
                    }
                  ],
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
  'v1/wallet/{userId}': {
    get: {
      tags: ['Wallet'],
      summary: 'Get user wallet',
      description: 'Get customer wallet',
      requestBody: {
        Content: 'application/json',
        Authorization: 'Bearer {token}',
      },
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
                    wallet: {},
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
  'v1/wallet/withdraw': {
    post: {
      tags: ['Wallet'],
      summary: 'Withdraw fiat',
      description:
        'Withdraw fiat to bank account',
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
                email: string,
                userId: string,
                issuer: string,
                amount: string,
                pinCode: string,
                currency: string,
                first_name: string,
                last_name: string,
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
                    wallet: {},

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
      security: [
        {
          Bearer: [],
        },
      ],
    },
  },
};
