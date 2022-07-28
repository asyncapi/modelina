/* eslint-disable */

import { TypeScriptGenerator, TS_COMMON_PRESET } from '../../../../src/generators'; 
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
    enumProp: { $id: 'EnumTest', enum: ['Some enum String', true, {test: 'test'}, 2]},
    numberProp: { type: 'number' }
  }
};
describe('Marshalling preset', () => {
  test('should render un/marshal code', async () => {
    const generator = new TypeScriptGenerator({ 
      presets: [
        {
          preset: TS_COMMON_PRESET,
          options: {
            marshalling: true
          }
        }
      ]
    });
    const models = await generator.generate(doc);
    expect(models).toHaveLength(3);
    expect(models[0].result).toMatchSnapshot(); 
    expect(models[1].result).toMatchSnapshot(); 
    expect(models[2].result).toMatchSnapshot(); 
  });
});
