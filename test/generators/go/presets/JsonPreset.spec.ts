import { GoGenerator, GO_JSON_PRESET } from '../../../../src/generators'; 
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
        GO_JSON_PRESET
      ]
    });
    const inputModel = await generator.process(doc);
    const nestedTestModel = inputModel.models['NestedTest'];
    const testModel = inputModel.models['Test'];
    const enumModel = inputModel.models['EnumTest'];

    const nestedTestClass = await generator.renderStruct(nestedTestModel, inputModel);
    const testClass = await generator.renderStruct(testModel, inputModel);
    const enumEnum = await generator.renderEnum(enumModel, inputModel);
    expect(nestedTestClass.result).toMatchSnapshot();
    expect(testClass.result).toMatchSnapshot();
    expect(enumEnum.result).toMatchSnapshot();
  });
});
