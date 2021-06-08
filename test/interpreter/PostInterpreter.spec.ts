import { CommonModel } from '../../src';
import { postInterpretModel } from '../../src/interpreter/PostInterpreter';
import { isModelObject } from '../../src/interpreter/Utils';
let mockedIsModelObjectReturn = false;
jest.mock('../../src/interpreter/Utils', () => {
  return {
    interpretName: jest.fn(),
    isModelObject: jest.fn().mockImplementation(() => {
      return mockedIsModelObjectReturn;
    })
  };
});
describe('PostInterpreter', () => {
  describe('postInterpretModel()', () => {
    test('should split models if properties contains model object', () => {
      mockedIsModelObjectReturn = true;
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
      expectedSchema2Model.type = 'object';
      expect(isModelObject).toHaveBeenNthCalledWith(1, expectedSchema2Model);
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema2Model);
    });
    test('should split models if items contains model object', () => {
      mockedIsModelObjectReturn = true;
      const model = CommonModel.toCommonModel({
        $id: 'schema1',
        items: {
          $id: 'schema2',
          type: 'object'
        }
      });
      const postProcessedModels = postInterpretModel(model);
      expect(postProcessedModels).toHaveLength(2);
      const expectedSchema1Model = new CommonModel();
      expectedSchema1Model.$id = 'schema1';
      const expectedItemModel = new CommonModel();
      expectedItemModel.$ref = 'schema2';
      expectedSchema1Model.items = expectedItemModel;
      const expectedSchema2Model = new CommonModel();
      expectedSchema2Model.$id = 'schema2';
      expectedSchema2Model.type = 'object';
      expect(isModelObject).toHaveBeenNthCalledWith(1, model.items);
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema2Model);
    });
    test('should split models if patternProperties contains model object', () => {
      mockedIsModelObjectReturn = true;
      const model = CommonModel.toCommonModel({
        $id: 'schema1',
        patternProperties: {
          testPattern: {
            $id: 'schema2',
            type: 'object'
          }
        }
      });
      const postProcessedModels = postInterpretModel(model);
      expect(postProcessedModels).toHaveLength(2);
      const expectedSchema1Model = new CommonModel();
      expectedSchema1Model.$id = 'schema1';
      const expectedPatternModel = new CommonModel();
      expectedPatternModel.$ref = 'schema2';
      expectedSchema1Model.patternProperties = {
        testPattern: expectedPatternModel
      };
      const expectedSchema2Model = new CommonModel();
      expectedSchema2Model.$id = 'schema2';
      expect(isModelObject).toHaveBeenNthCalledWith(1, model.patternProperties!['testPattern']);
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema2Model);
    });
    test('should split models if additionalProperties contains model object', () => {
      mockedIsModelObjectReturn = true;
      const model = CommonModel.toCommonModel({
        $id: 'schema1',
        additionalProperties: {
          $id: 'schema2',
          type: 'object'
        }
      });
      const postProcessedModels = postInterpretModel(model);
      expect(postProcessedModels).toHaveLength(2);
      const expectedSchema1Model = new CommonModel();
      expectedSchema1Model.$id = 'schema1';
      const expectedAdditionalPropertyModel = new CommonModel();
      expectedAdditionalPropertyModel.$ref = 'schema2';
      expectedSchema1Model.items = expectedAdditionalPropertyModel;
      const expectedSchema2Model = new CommonModel();
      expectedSchema2Model.$id = 'schema2';
      expect(isModelObject).toHaveBeenNthCalledWith(1, model.additionalProperties);
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema2Model);
    });
    test('should not split models if it is not considered model object', () => {
      mockedIsModelObjectReturn = false;
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
      expect(postProcessedModels).toHaveLength(1);
      const expectedSchema1Model = new CommonModel();
      expectedSchema1Model.$id = 'schema1';
      const expectedSchema2Model = new CommonModel();
      expectedSchema2Model.$id = 'schema2';
      expectedSchema1Model.properties = {
        testProp: expectedSchema2Model
      };
      expect(isModelObject).toHaveBeenNthCalledWith(1, model.properties!['testProp']);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema1Model);
    });
  });
});
