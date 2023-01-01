import { CppGenerator, CPP_DESCRIPTION_PRESET } from '../../../../src/generators/cpp'; 

describe('CPP_DESCRIPTION_PRESET', () => {
  let generator: CppGenerator;
  beforeEach(() => {
    generator = new CppGenerator({ presets: [CPP_DESCRIPTION_PRESET] });
  });

  test('should render description and examples for class', async () => {
    const doc = {
      $id: 'Clazz',
      type: 'object',
      description: 'Description for class',
      examples: [{ prop: 'value' }],
      properties: {
        prop: { type: 'string', description: 'Description for prop', examples: ['exampleValue'] },
      },
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
      enum: [
        'on',
        'off',
      ]
    };

    const models = await generator.generate(doc);
    expect(models).toHaveLength(1);
    expect(models[0].result).toMatchSnapshot();
  });
});
