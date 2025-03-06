import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator();
const AsyncAPIDocument = {
  asyncapi: '2.0.0',
  info: {
    title: 'Example with OpenAPI',
    version: '0.1.0'
  },
  channels: {
    example: {
      publish: {
        message: {
          schemaFormat: 'application/vnd.oai.openapi;version=3.0.0',
          payload: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                nullable: true
              },
              author: {
                type: 'string',
                example: 'Jack Johnson'
              }
            }
          }
        }
      }
    }
  }
};

export async function generate(): Promise<void> {
  const models = await generator.generate(AsyncAPIDocument);
  for (const model of models) {
    console.log(model.result);
  }
}

if (require.main === module) {
  generate();
}
