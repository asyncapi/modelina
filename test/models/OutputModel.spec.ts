import { CommonModel, IOutputModel, OutputModel } from '../../src/models'; 

describe('OutputModel', function() {
  test('should return an OutputModel', function() {
    const doc: any = { $id: 'test' };
    const commonModel = CommonModel.toCommonModel(doc);

    const ioutput: IOutputModel = {
      content: "content",
      commonModel,
    };
    const output = OutputModel.toOutputModel(ioutput);

    expect(output.content).toEqual(ioutput.content);
    expect(output.commonModel).toEqual(ioutput.commonModel);
  });

  test('should return an array of OutputModel', function() {
    const doc: any = { $id: 'test' };
    const commonModel = CommonModel.toCommonModel(doc);

    const ioutput: IOutputModel = {
      content: "content",
      commonModel,
    };
    const output = OutputModel.toOutputModels([ioutput, ioutput]);

    expect(output[0].content).toEqual(ioutput.content);
    expect(output[0].commonModel).toEqual(ioutput.commonModel);
    expect(output[1].content).toEqual(ioutput.content);
    expect(output[1].commonModel).toEqual(ioutput.commonModel);
  });
});
