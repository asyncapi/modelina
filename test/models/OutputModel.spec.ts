import { CommonInputModel, CommonModel, IOutputModel, OutputModel } from '../../src/models'; 

describe('OutputModel', function() {
  test('should return an OutputModel', function() {
    const doc: any = { $id: 'test' };
    const commonModel = CommonModel.toCommonModel(doc);

    const ioutput: IOutputModel = {
      result: "result",
      model: commonModel,
      modelName: "someModel",
      inputModel: new CommonInputModel(),
    };
    const output = OutputModel.toOutputModel(ioutput);

    expect(output.result).toEqual(ioutput.result);
    expect(output.model).toEqual(ioutput.model);
    expect(output.modelName).toEqual(ioutput.modelName);
    expect(output.inputModel).toEqual(ioutput.inputModel);
  });

  test('should return an array of OutputModel', function() {
    const doc: any = { $id: 'test' };
    const commonModel = CommonModel.toCommonModel(doc);

    const ioutput: IOutputModel = {
      result: "result",
      model: commonModel,
      modelName: "someModel",
      inputModel: new CommonInputModel(),
    };
    const output = OutputModel.toOutputModel([ioutput, ioutput]);

    expect(output[0].result).toEqual(ioutput.result);
    expect(output[0].model).toEqual(ioutput.model);
    expect(output[0].modelName).toEqual(ioutput.modelName);
    expect(output[0].inputModel).toEqual(ioutput.inputModel);
    expect(output[1].result).toEqual(ioutput.result);
    expect(output[1].model).toEqual(ioutput.model);
    expect(output[1].modelName).toEqual(ioutput.modelName);
    expect(output[1].inputModel).toEqual(ioutput.inputModel);
  });
});
