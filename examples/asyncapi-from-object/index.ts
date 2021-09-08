import { TypeScriptGenerator, OutputModel } from '../../src';

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
            type: 'object',
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

export async function generate() : Promise<OutputModel[]> {
  const generator = new TypeScriptGenerator({ modelType: 'interface' });
  return await generator.generate(AsyncAPIDocument);
}
