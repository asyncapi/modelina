import { GO_DESCRIPTION_PRESET, GoGenerator } from '../../../../src';

const doc = {
  $id: 'Test',
  type: 'object',
  additionalProperties: false,
  required: ['string prop'],
  description: 'Main Description',
  properties: {
    'string prop': { type: 'string' },
    numberProp: {
      type: 'number',
      description: 'Description'
    },
    objectProp: {
      type: 'object',
      additionalProperties: false,
      $id: 'NestedTest',
      properties: { stringProp: { type: 'string', description: 'string prop' } }
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
  let generator: GoGenerator;
  beforeEach(() => {
    generator = new GoGenerator({
      presets: [GO_DESCRIPTION_PRESET]
    });
  });

  test('should render example function for model', async () => {
    const models = await generator.generate(doc);
    expect(models).toHaveLength(2);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
  });
});
