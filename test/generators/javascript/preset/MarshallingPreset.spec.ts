import {
  JavaScriptGenerator,
  JS_COMMON_PRESET
} from '../../../../src/generators';
const doc = {
  definitions: {
    NestedTest: {
      type: 'object',
      $id: 'NestedTest',
      properties: { stringProp: { type: 'string' } }
    }
  },
  $id: 'Test',
  type: 'object',
  additionalProperties: { $ref: '#/definitions/NestedTest' },
  required: ['string prop'],
  properties: {
    'string prop': { type: 'string' },
    numberProp: { type: 'number' }
  }
};
describe('Marshalling preset', () => {
  test('should render un/marshal code', async () => {
    const generator = new JavaScriptGenerator({
      presets: [
        {
          preset: JS_COMMON_PRESET,
          options: {
            marshalling: true
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
