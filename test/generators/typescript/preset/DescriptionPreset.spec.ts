import { TS_DESCRIPTION_PRESET, TypeScriptGenerator } from '../../../../src';

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
    },
    anyProp: {
      type: 'object',
      $id: 'AnyTest',
      properties: {},
      description: 'AnyTest description'
    }
  }
};

describe('Description generation', () => {
  let generator: TypeScriptGenerator;
  beforeEach(() => {
    generator = new TypeScriptGenerator({
      presets: [TS_DESCRIPTION_PRESET]
    });
  });

  test('should render example function for model', async () => {
    const models = await generator.generate(doc);
    expect(models).toHaveLength(2);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
  });
});
