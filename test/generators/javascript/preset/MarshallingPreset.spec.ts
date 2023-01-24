/* eslint-disable */

import { JavaScriptGenerator, JS_COMMON_PRESET } from '../../../../src/generators';

import Ajv from 'ajv';
const doc = {
  definitions: {
    'NestedTest': {
      type: 'object', $id: 'NestedTest', properties: {stringProp: { type: 'string' }}
    }
  },
  $id: 'Test',
  type: 'object',
  additionalProperties: {$ref: '#/definitions/NestedTest'},
  required: ['string prop'],
  properties: {
    'string prop': { type: 'string' },
    numberProp: { type: 'number' },
    objectProp: { $ref: '#/definitions/NestedTest' }
  },
  patternProperties: {
    '^S(.?)test': { type: 'string' },
    '^S(.?)AnotherTest': { $ref: '#/definitions/NestedTest' },
  },
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
    const inputModel = await generator.process(doc);

    const testModel = inputModel.models['Test'];
    const nestedTestModel = inputModel.models['NestedTest'];

    const testClass = await generator.renderClass(testModel, inputModel);
    const nestedTestClass = await generator.renderClass(nestedTestModel, inputModel);

    expect(testClass.result).toMatchSnapshot();
    expect(nestedTestClass.result).toMatchSnapshot();
  });
});
