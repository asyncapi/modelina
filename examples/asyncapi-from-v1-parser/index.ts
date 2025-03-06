// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require('@asyncapi/parserV1');
import { TypeScriptGenerator } from '../../src';

const generator = new TypeScriptGenerator();
const AsyncAPIDocument = {
  asyncapi: '2.2.0',
  info: {
    title: 'example',
    version: '0.1.0'
  },
  channels: {
    '/test': {
      subscribe: {
        message: {
          payload: {
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
};

export async function generate(): Promise<void> {
  const parsedDoc = await parser.parse(JSON.stringify(AsyncAPIDocument));
  const models = await generator.generate(parsedDoc);
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
