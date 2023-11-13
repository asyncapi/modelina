import path from 'path';
import { InputType } from '../../src';
import {
  InputMetaModel,
  AnyModel,
  ConstrainedMetaModel
} from '../../src/models';
import { TestGenerator } from '../TestUtils/TestGenerator';

describe('AbstractGenerator', () => {
  let generator: TestGenerator;
  beforeEach(() => {
    generator = new TestGenerator();
  });

  test('generate() should return OutputModels', async () => {
    const cim = new InputMetaModel();
    const model = new AnyModel('test', undefined, {});
    cim.models[model.name] = model;
    const outputModels = await generator.generate(cim);

    expect(outputModels[0].result).toEqual('test');
    expect(outputModels[0].modelName).toEqual('TestName');
  });

  test('generateCompleteModels() should return OutputModels', async () => {
    const cim = new InputMetaModel();
    const model = new AnyModel('test', undefined, {});
    cim.models[model.name] = model;
    const outputModels = await generator.generateCompleteModels(cim, {});

    expect(outputModels[0].result).toEqual('test');
    expect(outputModels[0].modelName).toEqual('TestName');
  });

  test('generate() should process InputMetaModel instance', async () => {
    const cim = new InputMetaModel();
    const model = new AnyModel('test', undefined, {});
    cim.models[model.name] = model;
    const outputModels = await generator.generate(cim);
    expect(outputModels[0].result).toEqual('test');
    expect(outputModels[0].modelName).toEqual('TestName');
  });

  test('generateCompleteModels() should process InputMetaModel instance', async () => {
    const cim = new InputMetaModel();
    const model = new AnyModel('test', undefined, {});
    cim.models[model.name] = model;
    const outputModels = await generator.generateCompleteModels(cim, {});

    expect(outputModels[0].result).toEqual('test');
    expect(outputModels[0].modelName).toEqual('TestName');
  });

  test('generate() should process file input', async () => {
    const newGenerator = new TestGenerator({
      inputProcessor: { type: InputType.FILE }
    });
    const outputModels = await newGenerator.generate(path.resolve('test/generators/testasyncapi.yml'));
    expect(outputModels[0].result).toEqual('anonymous_schema_1');
    expect(outputModels[0].modelName).toEqual('TestName');
  });

  test('generateCompleteModels() should process InputMetaModel instance', async () => {
    const newGenerator = new TestGenerator({
      inputProcessor: { type: InputType.FILE }
    });
    const outputModels = await newGenerator.generate(path.resolve('test/generators/testasyncapi.yml'));

    expect(outputModels[0].result).toEqual('anonymous_schema_1');
    expect(outputModels[0].modelName).toEqual('TestName');
  });

  test('should `process` function return InputMetaModel', async () => {
    const doc: any = { type: 'string', $id: 'test' };
    const commonInputModel = await generator.process(doc);
    const keys = Object.keys(commonInputModel.models);

    expect(commonInputModel).toBeInstanceOf(InputMetaModel);
    expect(commonInputModel.models).toBeDefined();
    expect(keys).toHaveLength(1);
    expect(commonInputModel.models[keys[0]].originalInput).toEqual({
      $id: 'test',
      type: 'string',
      'x-modelgen-inferred-name': 'root'
    });
  });

  test('should `render` function return renderer model', async () => {
    const doc: any = { type: 'string', $id: 'SomeModel' };
    const commonInputModel = await generator.process(doc);
    const keys = Object.keys(commonInputModel.models);
    const renderedContent = await generator.render({
      constrainedModel: commonInputModel.models[
        keys[0]
      ] as ConstrainedMetaModel,
      inputModel: commonInputModel
    });

    expect(renderedContent.result).toEqual('SomeModel');
    expect(renderedContent.renderedName).toEqual('TestName');
    expect(renderedContent.dependencies).toEqual([]);
  });

  describe('getPresets()', () => {
    test('getPresets()', () => {
      const newGenerator = new TestGenerator({
        presets: [{ preset: { test: 'test2' }, options: {} }]
      });
      expect(newGenerator.testGetPresets('test')).toEqual([['test2', {}]]);
    });
  });
});
