import {
  JavaGenerator,
  JAVA_DESCRIPTION_PRESET
} from '../../../../src/generators';

describe('JAVA_DESCRIPTION_PRESET', () => {
  let generator: JavaGenerator;
  beforeEach(() => {
    generator = new JavaGenerator({ presets: [JAVA_DESCRIPTION_PRESET] });
  });

  test('should render description and examples for class', async () => {
    const doc = {
      $id: 'Clazz',
      type: 'object',
      description: 'Description for class',
      examples: [{ prop: 'value' }],
      properties: {
        prop: {
          type: 'string',
          description: 'Description for prop',
          examples: ['exampleValue']
        }
      }
    };
    const expectedDependencies = ['import java.util.Map;'];
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual(expectedDependencies);
  });

  test('should render description and examples for enum', async () => {
    const doc = {
      $id: 'Enum',
      type: 'string',
      description: 'Description for enum',
      examples: ['value'],
      enum: ['on', 'off']
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
    expect(models[0].dependencies).toEqual([]);
  });

  test('should not render anything when isExtended is true and model is discriminator or dictionary', async () => {
    const asyncapiDoc = {
      asyncapi: '2.6.0',
      info: {
        title: 'Test',
        version: '1.0.0'
      },
      channels: {},
      components: {
        messages: {
          extendDoc: {
            payload: {
              title: 'extendDoc',
              allOf: [
                { $ref: '#/components/schemas/extend' },
                {
                  type: 'object',
                  properties: {
                    type: {
                      const: 'ExtendDoc'
                    },
                    test2: {
                      type: 'string',
                      description: 'test',
                      examples: ['test']
                    }
                  }
                }
              ]
            }
          }
        },
        schemas: {
          extend: {
            type: 'object',
            discriminator: 'type',
            properties: {
              type: {
                title: 'discriminatorTest',
                type: 'string'
              },
              test3: {
                type: 'string'
              }
            },
            required: ['type']
          }
        }
      }
    };
    const generator = new JavaGenerator({
      presets: [JAVA_DESCRIPTION_PRESET],
      processorOptions: {
        interpreter: {
          allowInheritance: true
        }
      }
    });
    const models = await generator.generate(asyncapiDoc);
    expect(models).toHaveLength(3);
    expect(models.map((model) => model.result)).toMatchSnapshot();
  });
});
