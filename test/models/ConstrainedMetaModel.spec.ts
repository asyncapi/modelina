import { constrainMetaModel } from '../../src/helpers';
import { AnyModel, ArrayModel, BooleanModel, ConstrainedArrayModel, ConstrainedBooleanModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedObjectModel, ConstrainedObjectPropertyModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedUnionModel, DictionaryModel, EnumModel, EnumValueModel, FloatModel, IntegerModel, ObjectModel, ObjectPropertyModel, ReferenceModel, StringModel, TupleModel, TupleValueModel, UnionModel } from '../../src/models';
import { mockedConstraints, mockedTypeMapping } from '../TestUtils/TestConstrainer';

describe('ConstrainedMetaModel', () => {
  describe('ReferenceModel', () => {
    test('should return no dependencies', () => {
      const stringModel = new StringModel('', undefined);
      const rawModel = new ReferenceModel('', undefined, stringModel);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('StringModel', () => {
    test('should return no dependencies', () => {
      const rawModel = new StringModel('', undefined);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('AnyModel', () => {
    test('should return no dependencies', () => {
      const rawModel = new AnyModel('', undefined);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('FloatModel', () => {
    test('should return no dependencies', () => {
      const rawModel = new FloatModel('', undefined);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('IntegerModel', () => {
    test('should return no dependencies', () => {
      const rawModel = new IntegerModel('', undefined);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('BooleanModel', () => {
    test('should return no dependencies', () => {
      const rawModel = new BooleanModel('', undefined);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('TupleModel', () => {
    test('should return all reference dependencies', () => {
      const stringModel = new StringModel('', undefined);
      const referenceModel = new ReferenceModel('', undefined, stringModel);
      const referenceTupleModel = new TupleValueModel(0, referenceModel);
      const stringTupleModel = new TupleValueModel(1, stringModel);
      const rawModel = new TupleModel('test', undefined, [referenceTupleModel, stringTupleModel]);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      }) as ConstrainedTupleModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.tuple[0].value);
    });
    test('should return inner reference dependencies', () => {
      const stringModel = new StringModel('', undefined);
      const referenceModel = new ReferenceModel('', undefined, stringModel);
      const unionModel = new UnionModel('union', undefined, [stringModel, referenceModel]);
      const unionTupleModel = new TupleValueModel(0, unionModel);
      const stringTupleModel = new TupleValueModel(1, stringModel);
      const rawModel = new TupleModel('test', undefined, [unionTupleModel, stringTupleModel]);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      }) as ConstrainedTupleModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual((model.tuple[0].value as ConstrainedUnionModel).union[1]);
    });
  });
  describe('ObjectModel', () => {
    test('should return inner reference dependencies', () => {
      const stringModel = new StringModel('', undefined);
      const referenceModel = new ReferenceModel('', undefined, stringModel);
      const unionModel = new UnionModel('union', undefined, [stringModel, referenceModel]);
      const unionObjectPropertyModel = new ObjectPropertyModel('union', false, unionModel);
      const rawModel = new ObjectModel('test', undefined, {
        union: unionObjectPropertyModel
      });
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      }) as ConstrainedObjectModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual((model.properties['union'].property as ConstrainedUnionModel).union[1]);
    });
    test('should return all reference dependencies', () => {
      const stringModel = new StringModel('', undefined);
      const referenceModel = new ReferenceModel('', undefined, stringModel);
      const referenceObjectPropertyModel = new ObjectPropertyModel('reference', false, referenceModel);
      const stringObjectPropertyModel = new ObjectPropertyModel('string', false, stringModel);
      const rawModel = new ObjectModel('test', undefined, {
        reference: referenceObjectPropertyModel,
        string: stringObjectPropertyModel
      });
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      }) as ConstrainedObjectModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.properties['reference'].property);
    });

    describe('containsPropertyType', () => {
      test('should find present property type and those who are not', () => {
        const stringModel = new ConstrainedStringModel('', undefined, '');
        const stringObjectPropertyModel = new ConstrainedObjectPropertyModel('string', '', false, stringModel);
        const rawModel = new ConstrainedObjectModel('test', undefined, '', {
          string: stringObjectPropertyModel
        });
        expect(rawModel.containsPropertyType(ConstrainedStringModel)).toEqual(true);
        expect(rawModel.containsPropertyType(ConstrainedBooleanModel)).toEqual(false);
      });
    });
  });
  describe('EnumModel', () => {
    test('should return no dependencies', () => {
      const referenceEnumValueModel = new EnumValueModel('reference', 'referenceModel');
      const stringEnumValueModel = new EnumValueModel('string', 'stringModel');
      const rawModel = new EnumModel('test', undefined, [referenceEnumValueModel, stringEnumValueModel]);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      }) as ConstrainedEnumModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('DictionaryModel', () => {
    test('should return all reference dependencies', () => {
      const stringModel = new StringModel('', undefined);
      const referenceModel = new ReferenceModel('', undefined, stringModel);
      const rawModel = new DictionaryModel('test', undefined, referenceModel, stringModel);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      }) as ConstrainedDictionaryModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.key);
    });

    test('should return inner reference dependencies', () => {
      const stringModel = new StringModel('', undefined);
      const referenceModel = new ReferenceModel('', undefined, stringModel);
      const unionModel = new UnionModel('union', undefined, [stringModel, referenceModel]);
      const rawModel = new DictionaryModel('test', undefined, unionModel, stringModel);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      }) as ConstrainedDictionaryModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual((model.key as ConstrainedUnionModel).union[1]);
    });
  });
  describe('ArrayModel', () => {
    test('should return all reference dependencies', () => {
      const stringModel = new StringModel('', undefined);
      const referenceModel = new ReferenceModel('', undefined, stringModel);
      const rawModel = new ArrayModel('test', undefined, referenceModel);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      }) as ConstrainedArrayModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.valueModel);
    });
    test('should return nothing if no references are used', () => {
      const stringModel = new StringModel('', undefined);
      const rawModel = new ArrayModel('', undefined, stringModel);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });

    test('should return inner reference dependencies', () => {
      const stringModel = new StringModel('', undefined);
      const referenceModel = new ReferenceModel('', undefined, stringModel);
      const unionModel = new UnionModel('union', undefined, [stringModel, referenceModel]);
      const rawModel = new ArrayModel('', undefined, unionModel);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      }) as ConstrainedArrayModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual((model.valueModel as ConstrainedUnionModel).union[1]);
    });
  });
  describe('UnionModel', () => {
    test('should return all reference dependencies', () => {
      const stringModel = new StringModel('', undefined);
      const referenceModel = new ReferenceModel('', undefined, stringModel);
      const rawModel = new UnionModel('test', undefined, [referenceModel, stringModel]);
      
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined
      }) as ConstrainedUnionModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.union[0]);
    });
  });
});
