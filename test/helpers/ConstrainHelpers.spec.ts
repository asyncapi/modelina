import { constrainMetaModel } from '../../src/helpers';
import {
  AnyModel,
  ArrayModel,
  BooleanModel,
  ConstrainedAnyModel,
  ConstrainedArrayModel,
  ConstrainedBooleanModel,
  ConstrainedDictionaryModel,
  ConstrainedEnumModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedObjectModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedTupleModel,
  ConstrainedUnionModel,
  DictionaryModel,
  EnumModel,
  EnumValueModel,
  FloatModel,
  IntegerModel,
  ObjectModel,
  ObjectPropertyModel,
  ReferenceModel,
  StringModel,
  TupleModel,
  TupleValueModel,
  UnionModel
} from '../../src/models';
import {
  mockedConstraints,
  mockedTypeMapping
} from '../TestUtils/TestConstrainer';

describe('ConstrainHelpers', () => {
  const placeHolderModel = new AnyModel('', undefined, {});
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('constrain ObjectModel', () => {
    test('should constrain correctly', () => {
      const testProperty = new StringModel('', undefined, {});
      const metaModel = new ObjectModel(
        'test',
        undefined,
        {},
        {
          testProperty: new ObjectPropertyModel(
            'testProperty',
            false,
            testProperty
          )
        }
      );
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedObjectModel).toEqual(true);
      expect(
        (constrainedModel as ConstrainedObjectModel).properties['testProperty']
          .property instanceof ConstrainedStringModel
      ).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(2);
      expect(mockedConstraints.propertyKey).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Object).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(1);
    });

    test('should have access to partOfProperty', () => {
      const testProperty = new StringModel('', undefined, {});
      const metaModel = new ObjectModel(
        'test',
        undefined,
        {},
        {
          testProperty: new ObjectPropertyModel(
            'testProperty',
            false,
            testProperty
          )
        }
      );
      constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel,
        options: {},
        constrainedName: '',
        dependencyManager: undefined as never
      });
      expect(mockedTypeMapping.String).toHaveBeenCalledWith(
        expect.objectContaining({ partOfProperty: expect.objectContaining({}) })
      );
    });
    test('should handle recursive models', () => {
      const model = new ObjectModel('testObj', undefined, {}, {});
      const objectPropertyModel = new ObjectPropertyModel(
        'recursiveProp',
        false,
        model
      );
      model.properties['recursive'] = objectPropertyModel;

      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel: model,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedObjectModel).toEqual(true);
    });

    test('should handle extend', () => {
      const extendModel = new ObjectModel('extend', undefined, {}, {});
      const metaModel = new ObjectModel(
        'test',
        undefined,
        {
          extend: [extendModel]
        },
        {}
      );
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedObjectModel).toEqual(true);
      expect(constrainedModel.options.extend?.length).toEqual(1);
      expect(
        constrainedModel.options.extend?.at(0) instanceof ConstrainedObjectModel
      ).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(2);
      expect(mockedTypeMapping.Object).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain ReferenceModel', () => {
    test('should constrain correctly', () => {
      const stringModel = new StringModel('', undefined, {
        const: { originalInput: 'testConst' }
      });
      const metaModel = new ReferenceModel('', undefined, {}, stringModel);
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedReferenceModel).toEqual(
        true
      );
      expect(
        (constrainedModel as ConstrainedReferenceModel).ref instanceof
          ConstrainedStringModel
      ).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(2);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Reference).toHaveBeenCalledTimes(1);
      expect(mockedConstraints.constant).toHaveBeenCalledTimes(1);
    });

    test('should handle recursive models', () => {
      const metaModel = new ReferenceModel('', undefined, {}, placeHolderModel);
      metaModel.ref = metaModel;
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedReferenceModel).toEqual(
        true
      );
    });
  });
  describe('constrain AnyModel', () => {
    test('should constrain correctly', () => {
      const metaModel = new AnyModel('', undefined, {});
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedAnyModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Any).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain FloatModel', () => {
    test('should constrain correctly', () => {
      const metaModel = new FloatModel('', undefined, {});
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedFloatModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Float).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain IntegerModel', () => {
    test('should constrain correctly', () => {
      const metaModel = new IntegerModel('', undefined, {});
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedIntegerModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Integer).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain StringModel', () => {
    test('should constrain correctly', () => {
      const metaModel = new StringModel('', undefined, {
        const: { originalInput: 'testConst' }
      });
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedStringModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(1);
      expect(mockedConstraints.constant).toHaveBeenCalledTimes(1);
    });
  });
  describe('constrain BooleanModel', () => {
    test('should constrain correctly', () => {
      const metaModel = new BooleanModel('', undefined, {});
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedBooleanModel).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Boolean).toHaveBeenCalledTimes(1);
    });
  });

  describe('constrain TupleModel', () => {
    test('should constrain correctly', () => {
      const stringModel = new StringModel('', undefined, {});
      const metaModel = new TupleModel('test', undefined, {}, [
        new TupleValueModel(0, stringModel)
      ]);
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedTupleModel).toEqual(true);
      expect(
        (constrainedModel as ConstrainedTupleModel).tuple[0].value instanceof
          ConstrainedStringModel
      ).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(2);
      expect(mockedTypeMapping.Tuple).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(1);
    });
    test('should handle recursive models', () => {
      const metaModel = new TupleModel('test', undefined, {}, []);
      metaModel.tuple.push(new TupleValueModel(0, metaModel));
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedTupleModel).toEqual(true);
    });
  });
  describe('constrain ArrayModel', () => {
    test('should constrain correctly', () => {
      const stringModel = new StringModel('', undefined, {});
      const metaModel = new ArrayModel('test', undefined, {}, stringModel);
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedArrayModel).toEqual(true);
      expect(
        (constrainedModel as ConstrainedArrayModel).valueModel instanceof
          ConstrainedStringModel
      ).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(2);
      expect(mockedTypeMapping.Array).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(1);
    });
    test('should handle recursive models', () => {
      const metaModel = new ArrayModel('test', undefined, {}, placeHolderModel);
      metaModel.valueModel = metaModel;
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedArrayModel).toEqual(true);
    });
  });
  describe('constrain UnionModel', () => {
    test('should constrain correctly', () => {
      const stringModel = new StringModel('', undefined, {});
      const metaModel = new UnionModel('test2', undefined, {}, [stringModel]);
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedUnionModel).toEqual(true);
      expect(
        (constrainedModel as ConstrainedUnionModel).union[0] instanceof
          ConstrainedStringModel
      ).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(2);
      expect(mockedTypeMapping.Union).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(1);
    });
    test('should handle recursive models', () => {
      const metaModel = new UnionModel('test2', undefined, {}, []);
      metaModel.union.push(metaModel);
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedUnionModel).toEqual(true);
    });
    test('should handle discriminator', () => {
      const objectModel = new ObjectModel(
        '',
        undefined,
        {},
        {
          testDiscriminator: new ObjectPropertyModel(
            'testDiscriminator',
            true,
            new StringModel('', undefined, {})
          )
        }
      );
      const refModel = new ReferenceModel('', undefined, {}, objectModel);
      const metaModel = new UnionModel(
        '',
        undefined,
        { discriminator: { discriminator: 'testDiscriminator' } },
        [refModel]
      );
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedUnionModel).toEqual(true);
      expect(constrainedModel.options.discriminator?.type).toEqual('test');
    });
  });
  describe('constrain EnumModel', () => {
    test('should constrain correctly', () => {
      const metaModelValue = new EnumValueModel('test', 123);
      const metaModel = new EnumModel(
        'test',
        undefined,
        { const: { originalInput: 123 } },
        [metaModelValue]
      );
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedEnumModel).toEqual(true);
      const enumModel = constrainedModel as ConstrainedEnumModel;
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.Enum).toHaveBeenCalledTimes(1);
      expect(enumModel.values[0].key).toEqual('test');
      expect(enumModel.values[0].value).toEqual(123);
      expect(enumModel.options.const?.originalInput).toEqual(123);
    });
  });
  describe('constrain DictionaryModel', () => {
    test('should constrain correctly', () => {
      const stringModel = new StringModel('', undefined, {});
      const stringModel2 = new StringModel('', undefined, {});
      const metaModel = new DictionaryModel(
        'test',
        undefined,
        {},
        stringModel,
        stringModel2
      );
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedDictionaryModel).toEqual(
        true
      );
      expect(
        (constrainedModel as ConstrainedDictionaryModel).key instanceof
          ConstrainedStringModel
      ).toEqual(true);
      expect(
        (constrainedModel as ConstrainedDictionaryModel).value instanceof
          ConstrainedStringModel
      ).toEqual(true);
      expect(mockedConstraints.modelName).toHaveBeenCalledTimes(3);
      expect(mockedTypeMapping.Dictionary).toHaveBeenCalledTimes(1);
      expect(mockedTypeMapping.String).toHaveBeenCalledTimes(2);
    });
    test('should handle recursive models', () => {
      const metaModel = new DictionaryModel(
        'test',
        undefined,
        {},
        placeHolderModel,
        placeHolderModel
      );
      metaModel.key = metaModel;
      metaModel.value = metaModel;
      const constrainedModel = constrainMetaModel(
        mockedTypeMapping,
        mockedConstraints,
        {
          metaModel,
          options: {},
          constrainedName: '',
          dependencyManager: undefined as never
        }
      );
      expect(constrainedModel instanceof ConstrainedDictionaryModel).toEqual(
        true
      );
    });
  });
});
