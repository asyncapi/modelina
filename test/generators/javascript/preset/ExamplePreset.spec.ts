import {
  JavaScriptGenerator,
  JS_COMMON_PRESET
} from '../../../../src/generators';
const doc = {
  $id: 'Test',
  type: 'object',
  additionalProperties: true,
  required: ['string prop'],
  properties: {
    'string prop': { type: 'string' },
    numberProp: { type: 'number' },
    objectProp: {
      type: 'object',
      $id: 'NestedTest',
      properties: { stringProp: { type: 'string' } }
    }
  },
  patternProperties: {
    '^S(.?)test': {
      type: 'string'
    }
  }
};
describe('Example function generation', () => {
  test('should render example function for model', async () => {
    const generator = new JavaScriptGenerator({
      presets: [
        {
          preset: JS_COMMON_PRESET,
          options: {
            example: true
          }
        }
      ]
    });
    const models = await generator.generate(doc);
    expect(models).toHaveLength(2);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
  });
});
