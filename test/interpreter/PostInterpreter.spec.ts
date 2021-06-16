import { CommonModel } from '../../src';
import { postInterpretModel } from '../../src/interpreter/PostInterpreter';
import { isEnum, isModelObject } from '../../src/interpreter/Utils';
jest.mock('../../src/interpreter/Utils');
describe('PostInterpreter', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe('postInterpretModel()', () => {
    test('should handle recursive models', () => {
      const model = CommonModel.toCommonModel({
        $id: 'schema1',
        properties: { }
      });
      model.properties!['recursive'] = model;
      (isModelObject as jest.Mock).mockReturnValue(true);

      const postProcessedModels = postInterpretModel(model);

      const expectedSchema1Model = new CommonModel();
      expectedSchema1Model.$id = 'schema1';
      expectedSchema1Model.properties = {
        recursive: CommonModel.toCommonModel({
          $ref: 'schema1'
        })
      };
      expect(postProcessedModels).toHaveLength(1);
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
    });
    test('should split models on enums', () => {
      const rawModel = {
        $id: 'schema1',
        properties: {
          testProp: {
            $id: 'schema2',
            enum: [
              'test'
            ]
          }
        }
      };
      const model = CommonModel.toCommonModel(rawModel);
      (isEnum as jest.Mock).mockReturnValue(true);

      const postProcessedModels = postInterpretModel(model);

      const expectedSchema1Model = CommonModel.toCommonModel({
        $id: 'schema1',
        properties: {
          testProp: {
            $ref: 'schema2'
          }
        }
      });
      const expectedSchema2Model = CommonModel.toCommonModel({
        $id: 'schema2',
        enum: [
          'test'
        ]
      });

      expect(postProcessedModels).toHaveLength(2);
      expect(isEnum).toHaveBeenNthCalledWith(1, expectedSchema2Model);
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema2Model);
    });
    test('should split models when nested models occur', () => {
      const rawModel = {
        $id: 'schema1',
        properties: {
          testProp: {
            type: 'array',
            items: {
              $id: 'schema2',
              type: 'object'
            }
          }
        }
      };
      const model = CommonModel.toCommonModel(rawModel);
      (isModelObject as jest.Mock)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      const postProcessedModels = postInterpretModel(model);

      const expectedSchema1Model = CommonModel.toCommonModel({
        $id: 'schema1',
        properties: {
          testProp: {
            type: 'array',
            items: {
              $ref: 'schema2'
            }
          }
        }
      });
      const expectedSchema2Model = CommonModel.toCommonModel({
        $id: 'schema2',
        type: 'object'
      });

      expect(postProcessedModels).toHaveLength(2);
      expect(isModelObject).toHaveBeenNthCalledWith(1, expect.objectContaining({
        type: 'array'
      }));
      expect(isModelObject).toHaveBeenNthCalledWith(2, {
        $id: 'schema2',
        type: 'object'
      });
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema2Model);
    });
    test('should split models if properties contains model object', () => {
      const rawModel = {
        $id: 'schema1',
        properties: {
          testProp: {
            $id: 'schema2',
            type: 'object'
          }
        }
      };
      const model = CommonModel.toCommonModel(rawModel);
      (isModelObject as jest.Mock).mockReturnValue(true);

      const postProcessedModels = postInterpretModel(model);

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

      expect(postProcessedModels).toHaveLength(2);
      expect(isModelObject).toHaveBeenNthCalledWith(1, expectedSchema2Model);
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema2Model);
    });
    test('should split models if tuple items contains model object', () => {
      const rawModel = {
        $id: 'schema1',
        items: [
          {
            $id: 'schema2',
            type: 'object'
          } 
        ]
      };  
      const model = CommonModel.toCommonModel(rawModel);
      (isModelObject as jest.Mock).mockReturnValue(true);

      const postProcessedModels = postInterpretModel(model);

      const expectedSchema1Model = new CommonModel();
      expectedSchema1Model.$id = 'schema1';
      const expectedItemModel = new CommonModel();
      expectedItemModel.$ref = 'schema2';
      expectedSchema1Model.items = [expectedItemModel];
      const expectedSchema2Model = new CommonModel();
      expectedSchema2Model.$id = 'schema2';
      expectedSchema2Model.type = 'object';

      expect(postProcessedModels).toHaveLength(2);
      expect(isModelObject).toHaveBeenNthCalledWith(1, rawModel.items[0]);
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema2Model);
    });
    test('should split models if array item contains model object', () => {
      const rawModel = {
        $id: 'schema1',
        items: {
          $id: 'schema2',
          type: 'object'
        }
      };  
      const model = CommonModel.toCommonModel(rawModel);
      (isModelObject as jest.Mock).mockReturnValue(true);

      const postProcessedModels = postInterpretModel(model);

      const expectedSchema1Model = new CommonModel();
      expectedSchema1Model.$id = 'schema1';
      const expectedItemModel = new CommonModel();
      expectedItemModel.$ref = 'schema2';
      expectedSchema1Model.items = expectedItemModel;
      const expectedSchema2Model = new CommonModel();
      expectedSchema2Model.$id = 'schema2';
      expectedSchema2Model.type = 'object';

      expect(postProcessedModels).toHaveLength(2);
      expect(isModelObject).toHaveBeenNthCalledWith(1, rawModel.items);
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema2Model);
    });
    test('should split models if patternProperties contains model object', () => {
      const rawModel = {
        $id: 'schema1',
        patternProperties: {
          testPattern: {
            $id: 'schema2',
            type: 'object'
          }
        }
      };  
      const model = CommonModel.toCommonModel(rawModel);
      (isModelObject as jest.Mock).mockReturnValue(true);

      const postProcessedModels = postInterpretModel(model);

      const expectedSchema1Model = new CommonModel();
      expectedSchema1Model.$id = 'schema1';
      const expectedPatternModel = new CommonModel();
      expectedPatternModel.$ref = 'schema2';
      expectedSchema1Model.patternProperties = {
        testPattern: expectedPatternModel
      };
      const expectedSchema2Model = new CommonModel();
      expectedSchema2Model.$id = 'schema2';

      expect(postProcessedModels).toHaveLength(2);
      expect(isModelObject).toHaveBeenNthCalledWith(1, rawModel.patternProperties!['testPattern']);
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema2Model);
    });
    test('should split models if additionalProperties contains model object', () => {
      const rawModel = {
        $id: 'schema1',
        additionalProperties: {
          $id: 'schema2',
          type: 'object'
        }
      };
      const model = CommonModel.toCommonModel(rawModel);
      (isModelObject as jest.Mock).mockReturnValue(true);

      const postProcessedModels = postInterpretModel(model);

      const expectedAdditionalPropertyModel = new CommonModel();
      expectedAdditionalPropertyModel.$ref = 'schema2';
      const expectedSchema1Model = new CommonModel();
      expectedSchema1Model.$id = 'schema1';
      expectedSchema1Model.additionalProperties = expectedAdditionalPropertyModel;
      const expectedSchema2Model = new CommonModel();
      expectedSchema2Model.$id = 'schema2';

      expect(postProcessedModels).toHaveLength(2);
      expect(isModelObject).toHaveBeenNthCalledWith(1, rawModel.additionalProperties);
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
      expect(postProcessedModels[1]).toMatchObject(expectedSchema2Model);
    });
    test('should not split models if it is not considered model object', () => {
      const rawModel = {
        $id: 'schema1',
        properties: {
          testProp: {
            $id: 'schema2',
            type: 'object'
          }
        }
      };
      const model = CommonModel.toCommonModel(rawModel);
      (isModelObject as jest.Mock).mockReturnValue(false);

      const postProcessedModels = postInterpretModel(model);

      const expectedSchema1Model = new CommonModel();
      expectedSchema1Model.$id = 'schema1';
      const expectedSchema2Model = new CommonModel();
      expectedSchema2Model.$id = 'schema2';
      expectedSchema1Model.properties = {
        testProp: expectedSchema2Model
      };

      expect(postProcessedModels).toHaveLength(1);
      expect(isModelObject).toHaveBeenNthCalledWith(1, rawModel.properties!['testProp']);
      expect(postProcessedModels[0]).toMatchObject(expectedSchema1Model);
    });
  });
});
