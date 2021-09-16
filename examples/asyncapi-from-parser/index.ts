import { parse } from '@asyncapi/parser';
import { TypeScriptGenerator } from '@asyncapi/modelina';

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

export async function generate(logCallback : (msg: string) => void) : Promise<void> {
  const parsedDoc = await parse(JSON.stringify(AsyncAPIDocument));
  const models = await generator.generate(parsedDoc as any);
  for (const model of models) {
    logCallback(model.result);
  }
}
generate(console.log);
