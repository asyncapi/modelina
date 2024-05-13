import {
  CSharpGenerator,
  CSHARP_NEWTONSOFT_SERIALIZER_PRESET
} from '../../../../src/generators';
const doc = {
  $id: 'Test',
  type: 'object',
  additionalProperties: true,
  required: ['string prop'],
  properties: {
    'string prop': { type: 'string' },
    'const string prop': { type: 'string', const: 'abc' },
    numberProp: { type: 'number' },
    enumProp: {
      $id: 'EnumTest',
      enum: ['Some enum String', true, { test: 'test' }, 2]
    },
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
describe('Newtonsoft JSON serializer preset', () => {
  test('should render serialize and deserialize converters', async () => {
    const generator = new CSharpGenerator({
      presets: [CSHARP_NEWTONSOFT_SERIALIZER_PRESET]
    });

    const outputModels = await generator.generate(doc);
    expect(outputModels).toHaveLength(3);
    expect(outputModels[0].result).toMatchSnapshot();
    expect(outputModels[1].result).toMatchSnapshot();
    expect(outputModels[2].result).toMatchSnapshot();
  });
});
