import {
  CSharpGenerator,
  CSHARP_JSON_SERIALIZER_PRESET
} from '../../../../src/generators';
const doc = {
  $id: 'Test',
  type: 'object',
  additionalProperties: true,
  required: ['string prop'],
  properties: {
    'string prop': { type: 'string' },
    numberProp: { type: 'number' },
    enumProp: {
      $id: 'EnumTest',
      enum: ['Some enum String', true, { test: 'test' }, 2]
    },
    NumberPropWithCapitalCase: { type: 'number' },
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
describe('JSON serializer preset', () => {
  test('should render serialize and deserialize converters', async () => {
    const generator = new CSharpGenerator({
      presets: [CSHARP_JSON_SERIALIZER_PRESET]
    });

    const inputModel = await generator.generate(doc);
    expect(inputModel).toHaveLength(3);
    expect(inputModel[0].result).toMatchSnapshot();
    expect(inputModel[1].result).toMatchSnapshot();
    expect(inputModel[2].result).toMatchSnapshot();
  });
});
