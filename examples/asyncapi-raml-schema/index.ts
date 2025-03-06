import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator();
const AsyncAPIDocument = {
  asyncapi: '2.6.0',
  info: {
    title: 'Example with RAML',
    version: '0.1.0'
  },
  channels: {
    example: {
      publish: {
        message: {
          schemaFormat: 'application/raml+yaml;version=1.0',
          payload: {
            type: 'object',
            properties: {
              title: 'string',
              author: {
                type: 'string',
                examples: {
                  anExample: 'Jack Johnson'
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
  const models = await generator.generate(AsyncAPIDocument);
  for (const model of models) {
    console.log(model.result);
  }
}

if (require.main === module) {
  generate();
}
