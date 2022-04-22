import { TypeHelpers, ModelKind, getTypeFromMapping, TypeMapping } from '../../src/helpers'; 
import { CommonModel, ConstrainedAnyModel, ConstrainedArrayModel, ConstrainedBooleanModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedMetaModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedUnionModel } from '../../src/models';

describe('TypeHelpers', () => {
  describe('extractKind', () => {
    test('should return object', () => {
      const model = new CommonModel();
      model.type = 'object';
      const kind = TypeHelpers.extractKind(model);
  
      expect(kind).toEqual(ModelKind.OBJECT);
    });

    test('should return array', () => {
      const model = new CommonModel();
      model.type = 'array';
      const kind = TypeHelpers.extractKind(model);
  
      expect(kind).toEqual(ModelKind.ARRAY);
    });

    test('should return enum', () => {
      const model = new CommonModel();
      model.type = 'string';
      model.enum = ['someValue1', 'someValue2'];
      const kind = TypeHelpers.extractKind(model);
  
      expect(kind).toEqual(ModelKind.ENUM);
    });

    test('should return union', () => {
      const model = new CommonModel();
      model.type = ['number', 'string'];
      const kind = TypeHelpers.extractKind(model);
  
      expect(kind).toEqual(ModelKind.UNION);
    });

    test('should return primitive', () => {
      const model = new CommonModel();
      model.type = 'string';
      let kind = TypeHelpers.extractKind(model);
      expect(kind).toEqual(ModelKind.PRIMITIVE);

      model.type = 'number';
      kind = TypeHelpers.extractKind(model);
      expect(kind).toEqual(ModelKind.PRIMITIVE);

      model.type = 'integer';
      kind = TypeHelpers.extractKind(model);
      expect(kind).toEqual(ModelKind.PRIMITIVE);

      model.type = 'boolean';
      kind = TypeHelpers.extractKind(model);
      expect(kind).toEqual(ModelKind.PRIMITIVE);
    });
  });
  describe('getTypeFromMapping', () => {
    const typeFunction = () => {
      return 'test';
    };
    const typeMapping: TypeMapping = {
      Object: typeFunction,
      Reference: typeFunction,
      Any: typeFunction,
      Float: typeFunction, 
      Integer: typeFunction,
      String: typeFunction,
      Boolean: typeFunction,
      Tuple: typeFunction,
      Array: typeFunction,
      Enum: typeFunction,
      Union: typeFunction,
      Dictionary: typeFunction
    };
    test('should return undefined with generic constrained model', () => {
      const constrainedModel = new ConstrainedMetaModel('', undefined, '');
      const foundType = getTypeFromMapping(typeMapping, constrainedModel);
      expect(foundType).toBeUndefined();
    });
    const modelsToCheck = [
      new ConstrainedObjectModel('', undefined, '', {}),
      new ConstrainedReferenceModel('', undefined, '', new ConstrainedMetaModel('', undefined, '')),
      new ConstrainedAnyModel('', undefined, ''),
      new ConstrainedFloatModel('', undefined, ''),
      new ConstrainedIntegerModel('', undefined, ''),
      new ConstrainedStringModel('', undefined, ''),
      new ConstrainedBooleanModel('', undefined, ''),
      new ConstrainedTupleModel('', undefined, '', []),
      new ConstrainedArrayModel('', undefined, '', new ConstrainedMetaModel('', undefined, '')),
      new ConstrainedEnumModel('', undefined, '', []),
      new ConstrainedUnionModel('', undefined, '', []),
      new ConstrainedDictionaryModel('', undefined, '', new ConstrainedMetaModel('', undefined, ''), new ConstrainedMetaModel('', undefined, ''))
    ];
    test.each(modelsToCheck)('should return type from mapping', (constrainedModel: ConstrainedMetaModel) => {
      const foundType = getTypeFromMapping(typeMapping, constrainedModel);
      expect(foundType).toEqual('test');
    });
  });
});
