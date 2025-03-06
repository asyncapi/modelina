import { TypeScriptGenerator } from '../../../modelina/src';

const generator = new TypeScriptGenerator();
const swaggerDocument = {
  openapi: '3.1.0',
  info: {
    version: '0.1',
    title: 'Simple basic api'
  },
  paths: {
    '/test': {
      post: {
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid'
                  },
                  address: {
                    type: 'object',
                    properties: {}
                  },
                  profileImage: {
                    type: 'string',
                    contentMediaType: 'image/png',
                    contentEncoding: 'base64'
                  }
                }
              }
            }
          }
        },
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $schema: 'http://json-schema.org/draft-07/schema#',
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    email: {
                      type: 'string',
                      format: 'email'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export async function generate(): Promise<void> {
  const models = await generator.generate(swaggerDocument);
  for (const model of models) {
    console.log(model.result);
  }
}

if (require.main === module) {
  generate();
}
