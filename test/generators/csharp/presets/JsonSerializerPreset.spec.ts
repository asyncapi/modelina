import { CSharpGenerator, CSHARP_JSON_SERIALIZER_PRESET } from '../../../../src/generators'; 
const doc = {
  $id: 'Test',
  type: 'object',
  additionalProperties: true,
  required: ['string prop'],
  properties: {
    'string prop': { type: 'string' },
    numberProp: { type: 'number' },
    objectProp: { type: 'object', $id: 'NestedTest', properties: {stringProp: { type: 'string' }}}
  },
  patternProperties: {
    '^S(.?)test': {
      type: 'string'
    }
  },
};
describe('JSON serializer preset', () => {
  test('should render serialize and deserialize converters', async () => {
    const generator = new CSharpGenerator({ 
      presets: [
        CSHARP_JSON_SERIALIZER_PRESET
      ]
    });
    const inputModel = await generator.process(doc);
    const testModel = inputModel.models['Test'];
    const nestedTestModel = inputModel.models['NestedTest'];

    const testClass = await generator.renderClass(testModel, inputModel);
    const nestedTestClass = await generator.renderClass(nestedTestModel, inputModel);

    expect(testClass.result).toMatchSnapshot();
    expect(nestedTestClass.result).toMatchSnapshot();
  });
});
