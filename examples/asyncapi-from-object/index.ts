import { TypeScriptGenerator } from '../../lib';

const generator = new TypeScriptGenerator({ modelType: 'interface' });
const AsyncAPIDocument = {
  asyncapi: '2.1.0',
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

export async function generate(logCallback : (msg: string) => void): Promise<void> {
  const models = await generator.generate(AsyncAPIDocument);
  for (const model of models) {
    logCallback(model.result);
  }
}

generate(console.log);
