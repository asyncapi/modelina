import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator();
const jsonSchemaDraft7 = {
  asyncapi: '2.4.0',
  info: {
    title: 'Account Service',
    version: '1.0.0',
    description: 'This service is in charge of processing user signups'
  },
  channels: {
    'user/signedup': {
      subscribe: {
        message: {
          $ref: '#/components/messages/UserSignedUp'
        }
      }
    }
  },
  components: {
    messages: {
      UserSignedUp: {
        payload: {
          type: 'object',
          properties: {
            displayName: {
              type: 'string',
              description: 'Name of the user'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email of the user'
            },
            address: {
              oneOf: [
                {
                  type: 'null'
                },
                {
                  $ref: '#/components/schemas/Address'
                }
              ]
            }
          }
        }
      }
    },
    schemas: {
      Address: {
        type: 'object',
        properties: {
          line1: {
            type: 'string'
          },
          line2: {
            type: 'string'
          },
          postCode: {
            type: 'string'
          },
          city: {
            type: 'string'
          }
        }
      }
    }
  }
};

export async function generate(): Promise<void> {
  const models = await generator.generate(jsonSchemaDraft7);
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
