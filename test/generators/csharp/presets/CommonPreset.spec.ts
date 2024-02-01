import {
  CSharpGenerator,
  CSHARP_COMMON_PRESET
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
describe('CSHARP_COMMON_PRESET', () => {
  test('should render Equals support function', async () => {
    const generator = new CSharpGenerator({
      presets: [
        {
          preset: CSHARP_COMMON_PRESET,
          options: {
            equal: true,
            hashCode: false
          }
        }
      ]
    });
    const inputModel = await generator.generate(doc);
    expect(inputModel).toHaveLength(2);
    expect(inputModel[0].result).toMatchSnapshot();
    expect(inputModel[1].result).toMatchSnapshot();
  });
  test('should render GetHashCode support function', async () => {
    const generator = new CSharpGenerator({
      presets: [
        {
          preset: CSHARP_COMMON_PRESET,
          options: {
            equal: false,
            hashCode: true
          }
        }
      ]
    });
    const inputModel = await generator.generate(doc);
    expect(inputModel).toHaveLength(2);
    expect(inputModel[0].result).toMatchSnapshot();
    expect(inputModel[1].result).toMatchSnapshot();
  });
});
