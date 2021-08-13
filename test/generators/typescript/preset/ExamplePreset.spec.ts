/* eslint-disable */

import { TypeScriptGenerator, TS_COMMON_PRESET } from '../../../../src/generators';
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
describe('Marshalling preset', () => {
  test('should render un/marshal code', async () => {
    const generator = new TypeScriptGenerator({ 
      presets: [
        {
          preset: TS_COMMON_PRESET,
          options: {
            example: true
          }
        }
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
