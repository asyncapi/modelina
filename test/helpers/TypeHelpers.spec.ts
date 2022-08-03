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
    const typeMapping: TypeMapping<any> = {
      Object: jest.fn().mockReturnValue('test'),
      Reference: jest.fn().mockReturnValue('test'),
      Any: jest.fn().mockReturnValue('test'),
      Float: jest.fn().mockReturnValue('test'), 
      Integer: jest.fn().mockReturnValue('test'),
      String: jest.fn().mockReturnValue('test'),
      Boolean: jest.fn().mockReturnValue('test'),
      Tuple: jest.fn().mockReturnValue('test'),
      Array: jest.fn().mockReturnValue('test'),
      Enum: jest.fn().mockReturnValue('test'),
      Union: jest.fn().mockReturnValue('test'),
      Dictionary: jest.fn().mockReturnValue('test')
    };
    class CustomConstrainedMetaModel extends ConstrainedMetaModel {
      getNearestDependencies(): ConstrainedMetaModel[] {
        throw new Error('Method not implemented.');
      }
    }
    test('should return undefined with generic constrained model', () => {
      const constrainedModel = new CustomConstrainedMetaModel('', undefined, '');

      const t = () => {
        getTypeFromMapping(typeMapping, {constrainedModel, options: {}});
      };
      expect(t).toThrow('Could not find type for model');
    });
    const modelsToCheck = [
      new ConstrainedObjectModel('', undefined, '', {}),
      new ConstrainedReferenceModel('', undefined, '', new CustomConstrainedMetaModel('', undefined, '')),
      new ConstrainedAnyModel('', undefined, ''),
      new ConstrainedFloatModel('', undefined, ''),
      new ConstrainedIntegerModel('', undefined, ''),
      new ConstrainedStringModel('', undefined, ''),
      new ConstrainedBooleanModel('', undefined, ''),
      new ConstrainedTupleModel('', undefined, '', []),
      new ConstrainedArrayModel('', undefined, '', new CustomConstrainedMetaModel('', undefined, '')),
      new ConstrainedEnumModel('', undefined, '', []),
      new ConstrainedUnionModel('', undefined, '', []),
      new ConstrainedDictionaryModel('', undefined, '', new CustomConstrainedMetaModel('', undefined, ''), new CustomConstrainedMetaModel('', undefined, ''))
    ];
    test.each(modelsToCheck)('should return type from mapping', (constrainedModel: ConstrainedMetaModel) => {
      const foundType = getTypeFromMapping(typeMapping, {constrainedModel, options: {}});
      expect(foundType).toEqual('test');
    });
  });
});
