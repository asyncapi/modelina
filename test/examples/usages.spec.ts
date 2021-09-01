import { parse } from '@asyncapi/parser';
import { TypeScriptGenerator } from '../../src';

const AsyncAPIDocument = {
  asyncapi: '2.0.0',
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
const JSONSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
    }
  }
};
describe('Usages (./docs/usage.md)', () => {
  describe('Generate models from AsyncAPI documents', () => {
    test('from parser', async () => {
      const generator = new TypeScriptGenerator();
      const parsedDoc = await parse(JSON.stringify(AsyncAPIDocument));
      await generator.generate(parsedDoc as any);
      expect(true).toEqual(true);
    });
    test('from object', async () => {
      const generator = new TypeScriptGenerator();
      await generator.generate(AsyncAPIDocument);
      expect(true).toEqual(true);
    });
  });
  test('Generate models from JSON Schema draft 7 documents', async () => {
    const generator = new TypeScriptGenerator();
    await generator.generate(JSONSchema);
    expect(true).toEqual(true);
  });
});
