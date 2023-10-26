import { constrainMetaModel } from '../../src/helpers';
import {
  AnyModel,
  ArrayModel,
  BooleanModel,
  ConstrainedArrayModel,
  ConstrainedBooleanModel,
  ConstrainedDictionaryModel,
  ConstrainedEnumModel,
  ConstrainedMetaModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
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

describe('ConstrainedMetaModel', () => {
  test('should not carry over options from metaModel to constrainedModel', () => {
    const metaModel = new StringModel('', undefined, {
      const: {
        originalInput: 'testConst'
      },
      discriminator: {
        originalInput: 'testDiscriminator'
      }
    });

    class ConstrainedTestModel extends ConstrainedMetaModel {}

    const constrainedTestModel = new ConstrainedTestModel(
      '',
      undefined,
      metaModel.options,
      ''
    );

    expect(constrainedTestModel.options === metaModel.options).toEqual(false);
    expect(
      constrainedTestModel.options.const === metaModel.options.const
    ).toEqual(false);
    expect(
      constrainedTestModel.options.discriminator ===
        metaModel.options.discriminator
    ).toEqual(false);
  });

  describe('ReferenceModel', () => {
    test('should return no dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const rawModel = new ReferenceModel('', undefined, {}, stringModel);

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('StringModel', () => {
    test('should return no dependencies', () => {
      const rawModel = new StringModel('', undefined, {});

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('AnyModel', () => {
    test('should return no dependencies', () => {
      const rawModel = new AnyModel('', undefined, {});

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('FloatModel', () => {
    test('should return no dependencies', () => {
      const rawModel = new FloatModel('', undefined, {});

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('IntegerModel', () => {
    test('should return no dependencies', () => {
      const rawModel = new IntegerModel('', undefined, {});

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('BooleanModel', () => {
    test('should return no dependencies', () => {
      const rawModel = new BooleanModel('', undefined, {});

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('TupleModel', () => {
    test('should return all reference dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const referenceTupleModel = new TupleValueModel(0, referenceModel);
      const stringTupleModel = new TupleValueModel(1, stringModel);
      const rawModel = new TupleModel('test', undefined, {}, [
        referenceTupleModel,
        stringTupleModel
      ]);

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedTupleModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.tuple[0].value);
    });
    test('should return inner reference dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const unionModel = new UnionModel('union', undefined, {}, [
        stringModel,
        referenceModel
      ]);
      const unionTupleModel = new TupleValueModel(0, unionModel);
      const stringTupleModel = new TupleValueModel(1, stringModel);
      const rawModel = new TupleModel('test', undefined, {}, [
        unionTupleModel,
        stringTupleModel
      ]);
      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedTupleModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(
        (model.tuple[0].value as ConstrainedUnionModel).union[1]
      );
    });

    test('should not return duplicate dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const referenceTupleModel = new TupleValueModel(0, referenceModel);
      const reference2TupleModel = new TupleValueModel(1, referenceModel);
      const rawModel = new TupleModel('test', undefined, {}, [
        referenceTupleModel,
        reference2TupleModel
      ]);

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedTupleModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
    });

    test('should not return duplicate dependencies when different reference instances', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const referenceModel2 = new ReferenceModel(
        '',
        undefined,
        {},
        stringModel
      );
      const referenceTupleModel = new TupleValueModel(0, referenceModel);
      const reference2TupleModel = new TupleValueModel(1, referenceModel2);
      const rawModel = new TupleModel('test', undefined, {}, [
        referenceTupleModel,
        reference2TupleModel
      ]);

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedTupleModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
    });
  });
  describe('ObjectModel', () => {
    test('should return inner reference dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const unionModel = new UnionModel('union', undefined, {}, [
        stringModel,
        referenceModel
      ]);
      const unionObjectPropertyModel = new ObjectPropertyModel(
        'union',
        false,
        unionModel
      );
      const rawModel = new ObjectModel(
        'test',
        undefined,
        {},
        {
          union: unionObjectPropertyModel
        }
      );

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedObjectModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(
        (model.properties['union'].property as ConstrainedUnionModel).union[1]
      );
    });
    test('should return property dependency even if the name is the same as property', () => {
      const stringModel = new StringModel('arrayProp', undefined, {});
      const referenceModel = new ReferenceModel(
        'arrayProp',
        undefined,
        {},
        stringModel
      );
      const arrayModel = new ArrayModel(
        'arrayProp',
        undefined,
        {},
        referenceModel
      );
      const referenceArrayPropertyModel = new ObjectPropertyModel(
        'arrayProp',
        false,
        arrayModel
      );
      const rawModel = new ObjectModel(
        'test',
        undefined,
        {},
        {
          arrayProp: referenceArrayPropertyModel
        }
      );

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedObjectModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(
        (model.properties['arrayProp'].property as ConstrainedArrayModel)
          .valueModel
      );
    });
    test('should return all reference dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const referenceObjectPropertyModel = new ObjectPropertyModel(
        'reference',
        false,
        referenceModel
      );
      const stringObjectPropertyModel = new ObjectPropertyModel(
        'string',
        false,
        stringModel
      );
      const rawModel = new ObjectModel(
        'test',
        undefined,
        {},
        {
          reference: referenceObjectPropertyModel,
          string: stringObjectPropertyModel
        }
      );

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedObjectModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.properties['reference'].property);
    });

    test('should not return self reference', () => {
      const rawModel = new ObjectModel('ObjectTest', undefined, {}, {});
      const referenceModel = new ReferenceModel(
        rawModel.name,
        undefined,
        {},
        rawModel
      );
      const referenceObjectPropertyModel = new ObjectPropertyModel(
        'self',
        false,
        referenceModel
      );
      rawModel.properties['self'] = referenceObjectPropertyModel;

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedObjectModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });

    test('should not return duplicate dependencies', () => {
      const stringModel = new StringModel('string', undefined, {});
      const referenceModel = new ReferenceModel(
        'reference',
        undefined,
        {},
        stringModel
      );
      const referenceObjectPropertyModel = new ObjectPropertyModel(
        'reference',
        false,
        referenceModel
      );
      const reference2ObjectPropertyModel = new ObjectPropertyModel(
        'reference2',
        false,
        referenceModel
      );
      const rawModel = new ObjectModel(
        'test',
        undefined,
        {},
        {
          reference: referenceObjectPropertyModel,
          reference2: reference2ObjectPropertyModel
        }
      );

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedObjectModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.properties['reference'].property);
    });

    test('should not return duplicate dependencies when different reference instances', () => {
      const stringModel = new StringModel('string', undefined, {});
      const referenceModel = new ReferenceModel(
        'reference',
        undefined,
        {},
        stringModel
      );
      const referenceModel2 = new ReferenceModel(
        'reference',
        undefined,
        {},
        stringModel
      );
      const referenceObjectPropertyModel = new ObjectPropertyModel(
        'reference',
        false,
        referenceModel
      );
      const reference2ObjectPropertyModel = new ObjectPropertyModel(
        'reference2',
        false,
        referenceModel2
      );
      const rawModel = new ObjectModel(
        'test',
        undefined,
        {},
        {
          reference: referenceObjectPropertyModel,
          reference2: reference2ObjectPropertyModel
        }
      );

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedObjectModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.properties['reference'].property);
    });

    describe('containsPropertyType', () => {
      test('should find present property type and those who are not', () => {
        const stringModel = new ConstrainedStringModel('', undefined, {}, '');
        const stringObjectPropertyModel = new ConstrainedObjectPropertyModel(
          'string',
          '',
          false,
          stringModel
        );
        const rawModel = new ConstrainedObjectModel('test', undefined, {}, '', {
          string: stringObjectPropertyModel
        });
        expect(rawModel.containsPropertyType(ConstrainedStringModel)).toEqual(
          true
        );
        expect(rawModel.containsPropertyType(ConstrainedBooleanModel)).toEqual(
          false
        );
      });
    });
  });
  describe('EnumModel', () => {
    test('should return no dependencies', () => {
      const referenceEnumValueModel = new EnumValueModel(
        'reference',
        'referenceModel'
      );
      const stringEnumValueModel = new EnumValueModel('string', 'stringModel');
      const rawModel = new EnumModel('test', undefined, {}, [
        referenceEnumValueModel,
        stringEnumValueModel
      ]);

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedEnumModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });
  });
  describe('DictionaryModel', () => {
    test('should return all reference dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const rawModel = new DictionaryModel(
        'test',
        undefined,
        {},
        referenceModel,
        stringModel
      );

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedDictionaryModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.key);
    });

    test('should return inner reference dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const unionModel = new UnionModel('union', undefined, {}, [
        stringModel,
        referenceModel
      ]);
      const rawModel = new DictionaryModel(
        'test',
        undefined,
        {},
        unionModel,
        stringModel
      );

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedDictionaryModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(
        (model.key as ConstrainedUnionModel).union[1]
      );
    });

    test('should not return duplicate dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const rawModel = new DictionaryModel(
        'test',
        undefined,
        {},
        referenceModel,
        referenceModel
      );

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedDictionaryModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.key);
    });

    test('should not return duplicate dependencies when different reference instances', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const referenceModel2 = new ReferenceModel(
        '',
        undefined,
        {},
        stringModel
      );
      const rawModel = new DictionaryModel(
        'test',
        undefined,
        {},
        referenceModel,
        referenceModel2
      );

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedDictionaryModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.key);
    });
  });
  describe('ArrayModel', () => {
    test('should return all reference dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const rawModel = new ArrayModel('test', undefined, {}, referenceModel);

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedArrayModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.valueModel);
    });
    test('should return nothing if no references are used', () => {
      const stringModel = new StringModel('', undefined, {});
      const rawModel = new ArrayModel('', undefined, {}, stringModel);

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      });
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(0);
    });

    test('should return inner reference dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const unionModel = new UnionModel('union', undefined, {}, [
        stringModel,
        referenceModel
      ]);
      const rawModel = new ArrayModel('', undefined, {}, unionModel);

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedArrayModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(
        (model.valueModel as ConstrainedUnionModel).union[1]
      );
    });
  });
  describe('UnionModel', () => {
    test('should return all reference dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const rawModel = new UnionModel('test', undefined, {}, [
        referenceModel,
        stringModel
      ]);

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedUnionModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.union[0]);
    });

    test('should not return duplicate dependencies', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const rawModel = new UnionModel('test', undefined, {}, [
        referenceModel,
        referenceModel
      ]);

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedUnionModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.union[0]);
    });

    test('should not return duplicate dependencies when different reference instances', () => {
      const stringModel = new StringModel('', undefined, {});
      const referenceModel = new ReferenceModel('', undefined, {}, stringModel);
      const referenceModel2 = new ReferenceModel(
        '',
        undefined,
        {},
        stringModel
      );
      const rawModel = new UnionModel('test', undefined, {}, [
        referenceModel,
        referenceModel2
      ]);

      const model = constrainMetaModel(mockedTypeMapping, mockedConstraints, {
        metaModel: rawModel,
        constrainedName: '',
        options: undefined,
        dependencyManager: undefined as never
      }) as ConstrainedUnionModel;
      const dependencies = model.getNearestDependencies();
      expect(dependencies).toHaveLength(1);
      expect(dependencies[0]).toEqual(model.union[0]);
    });
  });
});
