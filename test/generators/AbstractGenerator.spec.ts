import { AbstractGenerator } from '../../src/generators'; 
import { IndentationTypes } from '../../src/helpers';
import { CommonInputModel, CommonModel } from '../../src/models';

export const testOptions = {
  indentation: {
    type: IndentationTypes.SPACES,
    size: 2,
  },
  namingConvention: {
    type: (name: string | undefined) => {
      return `type__${name || ''}`;
    },
    property: (name: string | undefined) => {
      return `property__${name || ''}`;
    }
  }
};
export class TestGenerator extends AbstractGenerator {
  constructor() {
    super("TestGenerator", testOptions);
  }

  render(model: CommonModel, inputModel: CommonInputModel): any {
    return model.$id || "rendered content";
  }
}

describe('AbstractGenerator', function() {
  let generator: TestGenerator;
  beforeEach(() => {
    generator = new TestGenerator();
  });

  test('should `generate` function return OutputModels', async function() {
    const doc: any = { $id: 'test' };
    const outputModels = await generator.generate(doc);

    expect(outputModels[0].result).toEqual('test');
  });

  test('generate() should process CommonInputModel instance', async function() {
    const cim = new CommonInputModel();
    const model = new CommonModel();
    model.$id = "test";
    cim.models[model.$id] = model;
    const outputModels = await generator.generate(cim);
    expect(outputModels[0].result).toEqual('test');
  });

  test('should `process` function return CommonInputModel', async function() {
    const doc: any = { $id: 'test' };
    const commonInputModel = await generator.process(doc);
    const keys = Object.keys(commonInputModel.models);

    expect(commonInputModel).toBeInstanceOf(CommonInputModel);
    expect(commonInputModel.models).toBeDefined();
    expect(keys).toHaveLength(1);
    expect(commonInputModel.models[keys[0]].originalSchema).toEqual({
      $id: 'test',
      'x-modelgen-inferred-name': 'root',
    });
  });

  test('should `render` function return renderer model', async function() {
    const doc: any = { $id: 'SomeModel' };
    const commonInputModel = await generator.process(doc);
    const keys = Object.keys(commonInputModel.models);
    const renderedContent = await generator.render(commonInputModel.models[keys[0]], commonInputModel);

    expect(renderedContent).toEqual("SomeModel");
  });

  describe('getPresets()', function() {
    test('getPresets()', async function() {
      class GeneratorWithPresets extends AbstractGenerator {
        constructor() {
          super("TestGenerator", {presets: [{"preset": {"test": "test2"}, "options": {}}]});
        }
        render(model: CommonModel, inputModel: CommonInputModel): any {
          return model.$id || "rendered content";
        }
        testGetPresets(string: string){
          return this.getPresets(string);
        }
      }
      let newGenerator = new GeneratorWithPresets();
      expect(newGenerator.testGetPresets("test")).toEqual([["test2", {}]]);
    });
  });
});
