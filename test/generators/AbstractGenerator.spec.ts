import { AbstractGenerator, FileGenerator } from '../../src/generators'; 
import { IndentationTypes } from '../../src/helpers';
import { InputMetaModel, CommonModel, OutputModel, RenderOutput } from '../../src/models';

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

  render(model: CommonModel, inputModel: InputMetaModel): Promise<RenderOutput> {
    return Promise.resolve(RenderOutput.toRenderOutput({result: model.$id || 'rendered content', renderedName: 'TestName'}));
  }

  renderCompleteModel(model: CommonModel, inputModel: InputMetaModel, options: any): Promise<RenderOutput> {
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

  test('generate() should process InputMetaModel instance', async () => {
    const cim = new InputMetaModel();
    const model = new CommonModel();
    model.$id = 'test';
    cim.models[model.$id] = model;
    const outputModels = await generator.generate(cim);
    expect(outputModels[0].result).toEqual('test');
    expect(outputModels[0].modelName).toEqual('TestName');
  });

  test('generateCompleteModels() should process InputMetaModel instance', async () => {
    const cim = new InputMetaModel();
    const model = new CommonModel();
    model.$id = 'test';
    cim.models[model.$id] = model;
    const outputModels = await generator.generateCompleteModels(cim, {});

    expect(outputModels[0].result).toEqual('rendered complete content');
    expect(outputModels[0].modelName).toEqual('TestName');
  });

  test('should `process` function return InputMetaModel', async () => {
    const doc: any = { $id: 'test' };
    const InputMetaModel = await generator.process(doc);
    const keys = Object.keys(InputMetaModel.models);

    expect(InputMetaModel).toBeInstanceOf(InputMetaModel);
    expect(InputMetaModel.models).toBeDefined();
    expect(keys).toHaveLength(1);
    expect(InputMetaModel.models[keys[0]].originalInput).toEqual({
      $id: 'test',
      'x-modelgen-inferred-name': 'root',
    });
  });

  test('should `render` function return renderer model', async () => {
    const doc: any = { $id: 'SomeModel' };
    const InputMetaModel = await generator.process(doc);
    const keys = Object.keys(InputMetaModel.models);
    const renderedContent = await generator.render(InputMetaModel.models[keys[0]], InputMetaModel);

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
        
        render(model: CommonModel, inputModel: InputMetaModel): any { return; }

        testGetPresets(string: string) {
          return this.getPresets(string);
        }

        renderCompleteModel(model: CommonModel, inputModel: InputMetaModel, options: any): Promise<RenderOutput> {
          throw new Error('Method not implemented.');
        }
      }
      const newGenerator = new GeneratorWithPresets();
      expect(newGenerator.testGetPresets('test')).toEqual([['test2', {}]]);
    });
  });
});
