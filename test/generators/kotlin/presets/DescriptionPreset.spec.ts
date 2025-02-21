import {
  KotlinGenerator,
  KOTLIN_DESCRIPTION_PRESET
} from '../../../../src/generators/kotlin';

describe('KOTLIN_DESCRIPTION_PRESET', () => {
  let generator: KotlinGenerator;
  beforeEach(() => {
    generator = new KotlinGenerator({ presets: [KOTLIN_DESCRIPTION_PRESET] });
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
        },
        anyProp: {
          type: 'object',
          $id: 'AnyTest',
          properties: {},
          description: 'AnyTest description'
        }
      }
    };
    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
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
  });
});
