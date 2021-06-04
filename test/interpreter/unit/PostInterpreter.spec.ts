import { CommonModel } from '../../../src';
import { postInterpretModel } from '../../../src/interpreter/PostInterpreter';

describe('PostInterpreter', () => {
  describe('postInterpretModel()', () => {
    test('should split out models ', () => {
      const model = CommonModel.toCommonModel({
        $id: 'schema1',
        properties: {
          testProp: {
            $id: 'schema2',
            type: 'object'
          }
        }
      });
      const postProcessedModels = postInterpretModel(model);
      expect(postProcessedModels).toHaveLength(2);
      const expectedSchema1Model = new CommonModel();
      expectedSchema1Model.$id = 'schema1';
      const expectedPropertyModel = new CommonModel();
      expectedPropertyModel.$ref = 'schema2';
      expectedSchema1Model.properties = {
        testProp: expectedPropertyModel
      };
      const expectedSchema2Model = new CommonModel();
      expectedSchema2Model.$id = 'schema2';
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema2Model);
    });
  });
});
