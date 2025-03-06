import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator();
const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    version: '0.1',
    title: 'Simple basic api'
  },
  paths: {
    '/test': {
      post: {
        requestBody: {
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
          },
          required: true
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
