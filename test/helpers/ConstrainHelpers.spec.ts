import { NO_NUMBER_START_CHAR, NO_EMPTY_VALUE, NO_DUPLICATE_PROPERTIES, FormatHelpers, NO_DUPLICATE_ENUM_KEYS, constrainMetaModel, TypeMapping, Constraints } from '../../src/helpers';
import { AnyModel, ArrayModel, BooleanModel, ConstrainedAnyModel, ConstrainedArrayModel, ConstrainedBooleanModel, ConstrainedDictionaryModel, ConstrainedEnumModel, ConstrainedEnumValueModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedObjectModel, ConstrainedObjectPropertyModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedTupleValueModel, ConstrainedUnionModel, DictionaryModel, EnumModel, EnumValueModel, FloatModel, IntegerModel, ObjectModel, ObjectPropertyModel, ReferenceModel, StringModel, TupleModel, TupleValueModel, UnionModel } from '../../src/models';
import { mockedConstraints, mockedTypeMapping } from '../TestUtils/TestConstrainer';

describe('ConstrainHelpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('constrain ObjectModel', () => {
    test('should constrain correctly', () => {
      const testProperty = new StringModel('', undefined);
      const metaModel = new ObjectModel('test', undefined, {
        testProperty: new ObjectPropertyModel('testProperty', false, testProperty)
      });
      const constrainedModel = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: ''
      });
      expect(constrainedModel instanceof ConstrainedObjectModel).toEqual(true);
      expect((constrainedModel as ConstrainedObjectModel).properties['testProperty'].property instanceof ConstrainedStringModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(2);
      expect(mockedConstraints.propertyKey).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Object).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain ReferenceModel', () => {
    test('should constrain correctly', () => {
      const stringModel = new StringModel('', undefined);
      const metaModel = new ReferenceModel('', undefined, stringModel);
      const constrainedModel = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: ''
      });
      expect(constrainedModel instanceof ConstrainedReferenceModel).toEqual(true);
      expect((constrainedModel as ConstrainedReferenceModel).ref instanceof ConstrainedStringModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(2);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Reference).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain AnyModel', () => {
    test('should constrain correctly', () => {
      const metaModel = new AnyModel('', undefined);
      const constrainedModel = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: ''
      });
      expect(constrainedModel instanceof ConstrainedAnyModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Any).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain FloatModel', () => {
    test('should constrain correctly', () => {
      const metaModel = new FloatModel('', undefined);
      const constrainedModel = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: ''
      });
      expect(constrainedModel instanceof ConstrainedFloatModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Float).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain IntegerModel', () => {
    test('should constrain correctly', () => {
      const metaModel = new IntegerModel('', undefined);
      const constrainedModel = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: ''
      });
      expect(constrainedModel instanceof ConstrainedIntegerModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Integer).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain StringModel', () => {
    test('should constrain correctly', () => {
      const metaModel = new StringModel('', undefined);
      const constrainedModel = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: ''
      });
      expect(constrainedModel instanceof ConstrainedStringModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain BooleanModel', () => {
    test('should constrain correctly', () => {
      const metaModel = new BooleanModel('', undefined);
      const constrainedModel = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: ''
      });
      expect(constrainedModel instanceof ConstrainedBooleanModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Boolean).toHaveBeenCalledTimes(1);
    });
  });

  describe('constrain TupleModel', () => {
    test('should constrain correctly', () => {
      const stringModel = new StringModel('', undefined);
      const metaModel = new TupleModel('test', undefined, [new TupleValueModel(0, stringModel)]);
      const constrainedModel = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: ''
      });
      expect(constrainedModel instanceof ConstrainedTupleModel).toEqual(true);
      expect((constrainedModel as ConstrainedTupleModel).tuple[0].value instanceof ConstrainedStringModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(2);
      expect(mockedTypeMapping.Tuple).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain ArrayModel', () => {
    test('should constrain correctly', () => {
      const stringModel = new StringModel('', undefined);
      const metaModel = new ArrayModel('test', undefined, stringModel);
      const constrainedModel = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: ''
      });
      expect(constrainedModel instanceof ConstrainedArrayModel).toEqual(true);
      expect((constrainedModel as ConstrainedArrayModel).valueModel instanceof ConstrainedStringModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(2);
      expect(mockedTypeMapping.Array).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain UnionModel', () => {
    test('should constrain correctly', () => {
      const stringModel = new StringModel('', undefined);
      const metaModel = new UnionModel('test', undefined, [stringModel]);
      const constrainedModel = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: ''
      });
      expect(constrainedModel instanceof ConstrainedUnionModel).toEqual(true);
      expect((constrainedModel as ConstrainedUnionModel).union[0] instanceof ConstrainedStringModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(2);
      expect(mockedTypeMapping.Union).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain EnumModel', () => {
    test('should constrain correctly', () => {
      const metaModel = new EnumModel('test', undefined, [new EnumValueModel('test', 123)]);
      const constrainedModel = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: ''
      });
      expect(constrainedModel instanceof ConstrainedEnumModel).toEqual(true);
      expect((constrainedModel as ConstrainedEnumModel).values[0] instanceof ConstrainedEnumValueModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Enum).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain DictionaryModel', () => {
    test('should constrain correctly', () => {
      const stringModel = new StringModel('', undefined);
      const metaModel = new DictionaryModel('test', undefined, stringModel, stringModel);
      const constrainedModel = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: ''
      });
      expect(constrainedModel instanceof ConstrainedDictionaryModel).toEqual(true);
      expect((constrainedModel as ConstrainedDictionaryModel).key instanceof ConstrainedStringModel).toEqual(true);
      expect((constrainedModel as ConstrainedDictionaryModel).value instanceof ConstrainedStringModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(3);
      expect(mockedTypeMapping.Dictionary).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(2);
    });
  });
});
