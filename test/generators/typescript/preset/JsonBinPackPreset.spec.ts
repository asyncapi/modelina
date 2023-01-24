import {
  TS_COMMON_PRESET,
  TS_JSONBINPACK_PRESET,
  TypeScriptGenerator
} from '../../../../src';

const doc = {
  $id: 'Test',
  type: 'object',
  additionalProperties: true,
  required: ['string prop'],
  description: 'Main Description',
  properties: {
    'string prop': { type: 'string' },
    numberProp: {
      type: 'number',
      description: 'Description',
      examples: 'Example'
    },
    objectProp: {
      type: 'object',
      $id: 'NestedTest',
      properties: { stringProp: { type: 'string' } },
      examples: ['Example 1', 'Example 2']
    }
  }
};

describe('JsonBinPack preset', () => {
  let generator: TypeScriptGenerator;
  beforeEach(() => {
    generator = new TypeScriptGenerator({
      presets: [
        {
          preset: TS_COMMON_PRESET,
          options: {
            marshalling: true
          }
        },
        TS_JSONBINPACK_PRESET
      ]
    });
  });

  test('should work fine with AsyncAPI inputs', async () => {
    const input = {
      asyncapi: '2.0.0',
      defaultContentType: 'application/json',
      info: {
        title: 'Signup service example (internal)',
        version: '0.1.0'
      },
      channels: {
        '/user/signedup': {
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
    const models = await generator.generate(input);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  test('should work fine with JSON Schema draft 4', async () => {
    const input = {
      $schema: 'http://json-schema.org/draft-04/schema',
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email'
        }
      }
    };
    const models = await generator.generate(input);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });

  test('should work fine with JSON Schema draft 6', async () => {
    const input = {
      $schema: 'http://json-schema.org/draft-06/schema',
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email'
        }
      }
    };
    const models = await generator.generate(input);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });
});
