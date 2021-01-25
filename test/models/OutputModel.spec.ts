import { CommonModel, IOutputModel, OutputModel } from '../../src/models'; 

describe('OutputModel', function() {

  describe('$id', function() {
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
      expect(output.commonModel).toEqual(ioutput.commonModel);
    });
  });
});
