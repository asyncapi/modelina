import {TS_DESCRIPTION_PRESET, TypeScriptGenerator} from '../../../../src';

const doc = {
  $id: 'Test',
  type: 'object',
  additionalProperties: true,
  required: ['string prop'],
  description: 'Main Description',
  properties: {
    'string prop': { type: 'string' },
    numberProp: {
      type: 'number',
      description: 'Description',
      examples: 'Example',
    },
    objectProp: {
      type: 'object',
      $id: 'NestedTest',
      properties: { stringProp: { type: 'string' } },
      examples: ['Example 1', 'Example 2'],
    },
  },
};

describe('Description generation', () => {
  let generator: TypeScriptGenerator;
  beforeEach(() => {
    generator = new TypeScriptGenerator({
      presets: [TS_DESCRIPTION_PRESET],
    });
  });

  test('should render example function for model', async () => {
    const inputModel = await generator.process(doc);
    const testModel = inputModel.models['Test'];
    const nestedTestModel = inputModel.models['NestedTest'];

    const testClass = await generator.renderClass(testModel, inputModel);
    const nestedTestClass = await generator.renderClass(
      nestedTestModel,
      inputModel
    );

    expect(testClass.result).toMatchSnapshot();
    expect(nestedTestClass.result).toMatchSnapshot();
  });
});
