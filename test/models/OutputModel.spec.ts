import {
  InputMetaModel,
  ToOutputModelArg,
  OutputModel,
  ConstrainedAnyModel
} from '../../src/models';

describe('OutputModel', () => {
  test('should return an OutputModel', () => {
    const ioutput: ToOutputModelArg = {
      result: 'result',
      model: new ConstrainedAnyModel('', undefined, ''),
      modelName: 'someModel',
      inputModel: new InputMetaModel(),
      dependencies: ['test']
    };
    const output = OutputModel.toOutputModel(ioutput);

    expect(output.result).toEqual(ioutput.result);
    expect(output.model).toEqual(ioutput.model);
    expect(output.modelName).toEqual(ioutput.modelName);
    expect(output.inputModel).toEqual(ioutput.inputModel);
    expect(output.dependencies).toEqual(ioutput.dependencies);
  });

  test('should return an array of OutputModel', () => {
    const ioutput: ToOutputModelArg = {
      result: 'result',
      model: new ConstrainedAnyModel('', undefined, ''),
      modelName: 'someModel',
      inputModel: new InputMetaModel(),
      dependencies: ['test']
    };
    const output = OutputModel.toOutputModel([ioutput, ioutput]);

    expect(output[0].result).toEqual(ioutput.result);
    expect(output[0].model).toEqual(ioutput.model);
    expect(output[0].modelName).toEqual(ioutput.modelName);
    expect(output[0].inputModel).toEqual(ioutput.inputModel);
    expect(output[0].dependencies).toEqual(ioutput.dependencies);
    expect(output[1].result).toEqual(ioutput.result);
    expect(output[1].model).toEqual(ioutput.model);
    expect(output[1].modelName).toEqual(ioutput.modelName);
    expect(output[1].inputModel).toEqual(ioutput.inputModel);
    expect(output[1].dependencies).toEqual(ioutput.dependencies);
  });
});
