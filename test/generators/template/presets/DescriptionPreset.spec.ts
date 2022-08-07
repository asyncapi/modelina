import { TemplateGenerator, TEMPLATE_DESCRIPTION_PRESET } from '../../../../src/generators/template'; 

describe('TEMPLATE_DESCRIPTION_PRESET', () => {
  let generator: TemplateGenerator;
  beforeEach(() => {
    generator = new TemplateGenerator({ presets: [TEMPLATE_DESCRIPTION_PRESET] });
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
