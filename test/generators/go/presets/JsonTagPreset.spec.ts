import { GoGenerator, GO_JSON_TAG_PRESET } from '../../../../src/generators'; 
const doc = {
  $id: 'Test',
  type: 'object',
  additionalProperties: {
    type: 'string'
  },
  required: ['string prop'],
  properties: {
    'string prop': { type: 'string' },
    numberProp: { type: 'number' },
    enumProp: { $id: 'EnumTest', enum: ['Some enum String', true, {test: 'test'}, 2]},
    objectProp: { type: 'object', $id: 'NestedTest', properties: {stringProp: { type: 'string' }}}
  },
  patternProperties: {
    '^S(.?)test': {
      type: 'string'
    }
  },
};
describe('JSON preset', () => {
  test('should render serialize and deserialize code', async () => {
    const generator = new GoGenerator({ 
      presets: [
        GO_JSON_TAG_PRESET
      ]
    });
    const models = await generator.generate(doc);
    expect(models[0].result).toMatchSnapshot();
    expect(models[1].result).toMatchSnapshot();
    expect(models[2].result).toMatchSnapshot();
  });
});
