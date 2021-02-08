import { AbstractGenerator } from '../../src/generators'; 
import { CommonInputModel, CommonModel } from '../../src/models';

describe('AbstractGenerator', function() {
  class TestGenerator extends AbstractGenerator {
    constructor() {
      super("TestGenerator", {});
    }

    render(model: CommonModel, inputModel: CommonInputModel): any {
      return model.$id || "rendered content";
    }
  }

  let generator: TestGenerator;
  beforeEach(() => {
    generator = new TestGenerator();
  });

  test('should `generate` function return OutputModels', async function() {
    const doc: any = { $id: 'test' };
    const outputModels = await generator.generate(doc);

    expect(outputModels[0].result).toEqual('test');
  });

  test('should `process` function return CommonInputModel', async function() {
    const doc: any = { $id: 'test' };
    const commonInputModel = await generator.process(doc);
    const keys = Object.keys(commonInputModel.models);

    expect(commonInputModel).toBeInstanceOf(CommonInputModel);
    expect(commonInputModel.models).toBeDefined();
    expect(keys).toHaveLength(1);
    expect(commonInputModel.models[keys[0]].originalSchema).toEqual(doc);
  });

  test('should `render` function return renderer model', async function() {
    const doc: any = { $id: 'SomeModel' };
    const commonInputModel = await generator.process(doc);
    const keys = Object.keys(commonInputModel.models);
    const renderedContent = await generator.render(commonInputModel.models[keys[0]], commonInputModel);

    expect(renderedContent).toEqual("SomeModel");
  });
});
