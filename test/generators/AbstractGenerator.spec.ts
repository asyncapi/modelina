import { AbstractGenerator, FileGenerator } from '../../src/generators'; 
import { IndentationTypes } from '../../src/helpers';
import { CommonInputModel, CommonModel, OutputModel, RenderOutput } from '../../src/models';

export const testOptions = {
  indentation: {
    type: IndentationTypes.SPACES,
    size: 2,
  }
};
export class TestGenerator extends AbstractGenerator {
  constructor() {
    super('TestGenerator', testOptions);
  }

  render(model: CommonModel, inputModel: CommonInputModel): Promise<RenderOutput> {
    return Promise.resolve(RenderOutput.toRenderOutput({result: model.$id || 'rendered content', renderedName: 'TestName'}));
  }

  renderCompleteModel(model: CommonModel, inputModel: CommonInputModel, options: any): Promise<RenderOutput> {
    return Promise.resolve(RenderOutput.toRenderOutput({result: 'rendered complete content', renderedName: 'TestName'}));
  }
}
describe('AbstractGenerator', () => {
  let generator: TestGenerator;
  beforeEach(() => {
    generator = new TestGenerator();
  });

  test('generate() should return OutputModels', async () => {
    const doc: any = { $id: 'test' };
    const outputModels = await generator.generate(doc);

    expect(outputModels[0].result).toEqual('test');
    expect(outputModels[0].modelName).toEqual('TestName');
  });

  test('generateCompleteModels() should return OutputModels', async () => {
    const doc: any = { $id: 'test' };
    const outputModels = await generator.generateCompleteModels(doc, {});

    expect(outputModels[0].result).toEqual('rendered complete content');
    expect(outputModels[0].modelName).toEqual('TestName');
  });

  test('generate() should process CommonInputModel instance', async () => {
    const cim = new CommonInputModel();
    const model = new CommonModel();
    model.$id = 'test';
    cim.models[model.$id] = model;
    const outputModels = await generator.generate(cim);
    expect(outputModels[0].result).toEqual('test');
    expect(outputModels[0].modelName).toEqual('TestName');
  });

  test('generateCompleteModels() should process CommonInputModel instance', async () => {
    const cim = new CommonInputModel();
    const model = new CommonModel();
    model.$id = 'test';
    cim.models[model.$id] = model;
    const outputModels = await generator.generateCompleteModels(cim, {});

    expect(outputModels[0].result).toEqual('rendered complete content');
    expect(outputModels[0].modelName).toEqual('TestName');
  });

  test('should `process` function return CommonInputModel', async () => {
    const doc: any = { $id: 'test' };
    const commonInputModel = await generator.process(doc);
    const keys = Object.keys(commonInputModel.models);

    expect(commonInputModel).toBeInstanceOf(CommonInputModel);
    expect(commonInputModel.models).toBeDefined();
    expect(keys).toHaveLength(1);
    expect(commonInputModel.models[keys[0]].originalInput).toEqual({
      $id: 'test',
      'x-modelgen-inferred-name': 'root',
    });
  });

  test('should `render` function return renderer model', async () => {
    const doc: any = { $id: 'SomeModel' };
    const commonInputModel = await generator.process(doc);
    const keys = Object.keys(commonInputModel.models);
    const renderedContent = await generator.render(commonInputModel.models[keys[0]], commonInputModel);

    expect(renderedContent.result).toEqual('SomeModel');
    expect(renderedContent.renderedName).toEqual('TestName');
    expect(renderedContent.dependencies).toEqual([]);
  });

  describe('getPresets()', () => {
    test('getPresets()', () => {
      class GeneratorWithPresets extends AbstractGenerator<any, any> {
        constructor() {
          super('TestGenerator', {presets: [{preset: {test: 'test2'}, options: {}}]});
        }
        
        render(model: CommonModel, inputModel: CommonInputModel): any { return; }

        testGetPresets(string: string) {
          return this.getPresets(string);
        }

        renderCompleteModel(model: CommonModel, inputModel: CommonInputModel, options: any): Promise<RenderOutput> {
          throw new Error('Method not implemented.');
        }
      }
      const newGenerator = new GeneratorWithPresets();
      expect(newGenerator.testGetPresets('test')).toEqual([['test2', {}]]);
    });
  });
});
