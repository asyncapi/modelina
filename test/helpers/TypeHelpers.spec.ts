import { getTypeFromMapping, TypeMapping } from '../../src/helpers';
import {
  ConstrainedAnyModel,
  ConstrainedArrayModel,
  ConstrainedBooleanModel,
  ConstrainedDictionaryModel,
  ConstrainedEnumModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedTupleModel,
  ConstrainedUnionModel
} from '../../src/models';

describe('TypeHelpers', () => {
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
      const constrainedModel = new CustomConstrainedMetaModel(
        '',
        undefined,
        ''
      );
      const t = () => {
        getTypeFromMapping(typeMapping, { constrainedModel, options: {} });
      };
      expect(t).toThrow('Could not find type for model');
    });

    const modelsToCheck = [
      new ConstrainedObjectModel('', undefined, '', {}),
      new ConstrainedReferenceModel(
        '',
        undefined,
        '',
        new CustomConstrainedMetaModel('', undefined, '')
      ),
      new ConstrainedAnyModel('', undefined, ''),
      new ConstrainedFloatModel('', undefined, ''),
      new ConstrainedIntegerModel('', undefined, ''),
      new ConstrainedStringModel('', undefined, ''),
      new ConstrainedBooleanModel('', undefined, ''),
      new ConstrainedTupleModel('', undefined, '', []),
      new ConstrainedArrayModel(
        '',
        undefined,
        '',
        new CustomConstrainedMetaModel('', undefined, '')
      ),
      new ConstrainedEnumModel('', undefined, '', []),
      new ConstrainedUnionModel('', undefined, '', []),
      new ConstrainedDictionaryModel(
        '',
        undefined,
        '',
        new CustomConstrainedMetaModel('', undefined, ''),
        new CustomConstrainedMetaModel('', undefined, '')
      )
    ];
    test.each(modelsToCheck)(
      'should return type from mapping',
      (constrainedModel: ConstrainedMetaModel) => {
        const foundType = getTypeFromMapping(typeMapping, {
          constrainedModel,
          options: {}
        });
        expect(foundType).toEqual('test');
      }
    );
  });
});
