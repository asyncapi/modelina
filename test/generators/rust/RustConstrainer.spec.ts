import {
  deriveEq,
  deriveHash,
  deriveCopy,
  RustDefaultTypeMapping
} from '../../../src/generators/rust/RustConstrainer';
import {
  ConstrainedAnyModel,
  ConstrainedArrayModel,
  ConstrainedTupleValueModel,
  ConstrainedEnumValueModel,
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
  RustGenerator,
  ConstrainedObjectPropertyModel
} from '../../../src';
import { RustDependencyManager } from '../../../src/generators/rust/RustDependencyManager';
describe('RustConstrainer', () => {
  const defaultOptions = {
    options: RustGenerator.defaultOptions,
    dependencyManager: new RustDependencyManager(RustGenerator.defaultOptions)
  };
  describe('ObjectModel', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedObjectModel('test', undefined, {}, '', {});
      const type = RustDefaultTypeMapping.Object({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual(model.name);
    });
  });
  describe('Reference', () => {
    test('should render the constrained name as type', () => {
      const refModel = new ConstrainedAnyModel('test', undefined, {}, '');
      const model = new ConstrainedReferenceModel(
        'test',
        undefined,
        {},
        '',
        refModel
      );
      const type = RustDefaultTypeMapping.Reference({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual(model.name);
    });
  });
  describe('Any', () => {
    test('should render type', () => {
      const model = new ConstrainedAnyModel('test', undefined, {}, '');
      const type = RustDefaultTypeMapping.Any({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('serde_json::Value');
    });
  });
  describe('Float', () => {
    test('should render type', () => {
      const model = new ConstrainedFloatModel('test', undefined, {}, '');
      const type = RustDefaultTypeMapping.Float({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('f64');
    });
    test('should render f32 when format has number format', () => {
      const model = new ConstrainedFloatModel(
        'test',
        {},
        { format: 'float32' },
        ''
      );
      const type = RustDefaultTypeMapping.Float({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('f32');
    });
  });
  describe('Integer', () => {
    test('should render type', () => {
      const model = new ConstrainedIntegerModel('test', undefined, {}, '');
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('i32');
    });
    test('should render int when format has integer format', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'integer' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('i32');
    });
    test('should render int when format has int32 format', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'int32' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('i32');
    });
    test('should render long when format has long format', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'long' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('i64');
    });
    test('should render long when format has int64 format', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'int64' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('i64');
    });
    test('should render u8 when format is u8', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'u8' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('u8');
    });

    test('should render u16 when format is u16', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'u16' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('u16');
    });

    test('should render u32 when format is u32', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'u32' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('u32');
    });

    test('should render u64 when format is u64', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'u64' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('u64');
    });

    test('should render u128 when format is u128', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'u128' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('u128');
    });

    test('should render uint32 format as u32', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'uint32' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('u32');
    });

    test('should render uint64 format as u64', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'uint64' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('u64');
    });

    test('should render i8 when format is int8', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'int8' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('i8');
    });

    test('should render i16 when format is int16', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'int16' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('i16');
    });

    test('should render i128 when format is int128', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'int128' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('i128');
    });

    test('should render u8 when format is uint8', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'uint8' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('u8');
    });

    test('should render u16 when format is uint16', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'uint16' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('u16');
    });

    test('should render u128 when format is uint128', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'uint128' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('u128');
    });

    test('should render default i32 when format is unknown', () => {
      const model = new ConstrainedIntegerModel(
        'test',
        {},
        { format: 'unknown' },
        ''
      );
      const type = RustDefaultTypeMapping.Integer({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('i32');
    });
  });
  describe('String', () => {
    test('should render type', () => {
      const model = new ConstrainedStringModel('test', undefined, {}, '');
      const type = RustDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('String');
    });
    test('should render Vec<u8> when format has binary format', () => {
      const model = new ConstrainedStringModel(
        'test',
        {},
        { format: 'binary' },
        ''
      );
      const type = RustDefaultTypeMapping.String({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Vec<u8>');
    });
  });
  describe('Boolean', () => {
    test('should render type', () => {
      const model = new ConstrainedBooleanModel('test', undefined, {}, '');
      const type = RustDefaultTypeMapping.Boolean({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('bool');
    });
  });

  describe('Tuple', () => {
    test('should render type', () => {
      const model = new ConstrainedTupleModel('Test', undefined, {}, '', []);
      const type = RustDefaultTypeMapping.Tuple({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Test');
    });
  });

  describe('Array', () => {
    test('should render type', () => {
      const arrayModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'String'
      );
      const model = new ConstrainedArrayModel(
        'test',
        undefined,
        {},
        '',
        arrayModel
      );
      const type = RustDefaultTypeMapping.Array({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Vec<String>');
    });
  });

  describe('Enum', () => {
    test('should render the constrained name as type', () => {
      const model = new ConstrainedEnumModel('Test', undefined, {}, '', []);
      const type = RustDefaultTypeMapping.Enum({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual(model.name);
    });
  });

  describe('Union', () => {
    test('should render type', () => {
      const model = new ConstrainedUnionModel('Test', undefined, {}, '', []);
      const type = RustDefaultTypeMapping.Union({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('Test');
    });
  });

  describe('Dictionary', () => {
    test('should render type', () => {
      const keyModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'String'
      );
      const valueModel = new ConstrainedStringModel(
        'test',
        undefined,
        {},
        'String'
      );
      const model = new ConstrainedDictionaryModel(
        'test',
        undefined,
        {},
        '',
        keyModel,
        valueModel
      );
      const type = RustDefaultTypeMapping.Dictionary({
        constrainedModel: model,
        ...defaultOptions
      });
      expect(type).toEqual('std::collections::HashMap<String, String>');
    });
  });

  describe('derive', () => {
    const i32Model = new ConstrainedIntegerModel('test', undefined, {}, '');
    const i64Model = new ConstrainedIntegerModel(
      'test',
      { format: 'int64' },
      {},
      ''
    );
    const f64Model = new ConstrainedFloatModel('test', undefined, {}, '');
    const f32Model = new ConstrainedFloatModel(
      'test',
      { format: 'float32' },
      {},
      ''
    );
    const dictModel = new ConstrainedDictionaryModel(
      'test',
      undefined,
      {},
      '',
      f32Model,
      f64Model
    );
    const anyModel = new ConstrainedAnyModel('test', undefined, {}, '');
    const boolModel = new ConstrainedBooleanModel('test', undefined, {}, '');
    const stringModel = new ConstrainedStringModel(
      'test',
      undefined,
      {},
      'String'
    );

    describe('deriveCopy', () => {
      test('should return false for types that do not implement Copy trait', () => {
        const refModel = new ConstrainedReferenceModel(
          'test',
          undefined,
          {},
          '',
          stringModel
        );
        const tupleModel = new ConstrainedTupleModel(
          'test',
          undefined,
          {},
          '',
          [
            new ConstrainedTupleValueModel(0, stringModel),
            new ConstrainedTupleValueModel(1, anyModel)
          ]
        );
        const unionModel = new ConstrainedUnionModel(
          'test',
          undefined,
          {},
          '',
          [stringModel, refModel, dictModel, anyModel, tupleModel]
        );
        const enumModel = new ConstrainedEnumModel('test', undefined, {}, '', [
          new ConstrainedEnumValueModel('one', stringModel, {}),
          new ConstrainedEnumValueModel('two', stringModel, {})
        ]);

        const objectModel = new ConstrainedObjectModel(
          'test',
          undefined,
          {},
          '',
          {
            stringProp: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              stringModel
            ),
            refProp: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              refModel
            ),
            dictProp: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              dictModel
            ),
            anyProp: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              anyModel
            ),
            tupleModel: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              tupleModel
            ),
            unionModel: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              unionModel
            ),
            enumModel: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              enumModel
            )
          }
        );
        const arrayModel = new ConstrainedArrayModel(
          'test',
          undefined,
          {},
          '',
          refModel
        );
        expect(deriveCopy(stringModel)).toEqual(false);
        expect(deriveCopy(refModel)).toEqual(false);
        expect(deriveCopy(unionModel)).toEqual(false);
        expect(deriveCopy(dictModel)).toEqual(false);
        expect(deriveCopy(anyModel)).toEqual(false);
        expect(deriveCopy(tupleModel)).toEqual(false);
        expect(deriveCopy(refModel)).toEqual(false);
        expect(deriveCopy(enumModel)).toEqual(false);
        expect(deriveCopy(objectModel)).toEqual(false);
        expect(deriveCopy(arrayModel)).toEqual(false);
      });

      test('should return true for types that implement Copy trait', () => {
        const i32Model = new ConstrainedIntegerModel('test', undefined, {}, '');
        const i64Model = new ConstrainedIntegerModel(
          'test',
          { format: 'int64' },
          {},
          ''
        );
        const f64Model = new ConstrainedFloatModel('test', undefined, {}, '');
        const f32Model = new ConstrainedFloatModel(
          'test',
          { format: 'float32' },
          {},
          ''
        );
        const boolModel = new ConstrainedBooleanModel(
          'test',
          undefined,
          {},
          ''
        );
        const tupleModel = new ConstrainedTupleModel(
          'test',
          undefined,
          {},
          '',
          [
            new ConstrainedTupleValueModel(0, boolModel),
            new ConstrainedTupleValueModel(1, boolModel)
          ]
        );
        const arrayModel = new ConstrainedArrayModel(
          'test',
          undefined,
          {},
          '',
          i32Model
        );
        const enumModel = new ConstrainedEnumModel('test', undefined, {}, '', [
          new ConstrainedEnumValueModel('one', i32Model, {}),
          new ConstrainedEnumValueModel('two', i32Model, {})
        ]);

        const unionModel = new ConstrainedUnionModel(
          'test',
          undefined,
          {},
          '',
          [
            i32Model,
            i64Model,
            f64Model,
            f32Model,
            boolModel,
            tupleModel,
            arrayModel,
            enumModel
          ]
        );

        const objectModel = new ConstrainedObjectModel(
          'test',
          undefined,
          {},
          '',
          {
            i32Model: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              i32Model
            ),
            i64Model: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              i64Model
            ),
            f32Model: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              f32Model
            ),
            f64Mode: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              f64Model
            ),
            tupleModel: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              tupleModel
            ),
            unionModel: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              unionModel
            ),
            enumModel: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              enumModel
            )
          }
        );

        expect(deriveCopy(i32Model)).toEqual(true);
        expect(deriveCopy(i64Model)).toEqual(true);
        expect(deriveCopy(f64Model)).toEqual(true);
        expect(deriveCopy(f32Model)).toEqual(true);
        expect(deriveCopy(boolModel)).toEqual(true);
        expect(deriveCopy(tupleModel)).toEqual(true);
        expect(deriveCopy(arrayModel)).toEqual(true);
        expect(deriveCopy(enumModel)).toEqual(true);
        expect(deriveCopy(unionModel)).toEqual(true);
        expect(deriveCopy(objectModel)).toEqual(true);
      });
    });

    describe('deriveHash', () => {
      test('should return false for types that do not implement Hash trait', () => {
        expect(deriveHash(f64Model)).toEqual(false);
        expect(deriveHash(f32Model)).toEqual(false);
        expect(deriveHash(dictModel)).toEqual(false);
        expect(deriveHash(anyModel)).toEqual(false);
      });

      test('should return true for types that implement Hash trait', () => {
        const tupleModel = new ConstrainedTupleModel(
          'test',
          undefined,
          {},
          '',
          [
            new ConstrainedTupleValueModel(0, boolModel),
            new ConstrainedTupleValueModel(1, boolModel)
          ]
        );
        const arrayModel = new ConstrainedArrayModel(
          'test',
          undefined,
          {},
          '',
          i32Model
        );
        const enumModel = new ConstrainedEnumModel('test', undefined, {}, '', [
          new ConstrainedEnumValueModel('one', i32Model, {}),
          new ConstrainedEnumValueModel('two', i32Model, {})
        ]);

        const unionModel = new ConstrainedUnionModel(
          'test',
          undefined,
          {},
          '',
          [i32Model, i64Model, boolModel, tupleModel, arrayModel, enumModel]
        );

        const objectModel = new ConstrainedObjectModel(
          'test',
          undefined,
          {},
          '',
          {
            stringProp: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              stringModel
            ),
            i32Model: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              i32Model
            ),
            i64Model: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              i64Model
            ),
            boolProp: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              boolModel
            ),
            tupleModel: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              tupleModel
            ),
            unionModel: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              unionModel
            ),
            enumModel: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              enumModel
            )
          }
        );
        expect(deriveHash(stringModel)).toEqual(true);
        expect(deriveHash(i32Model)).toEqual(true);
        expect(deriveHash(i64Model)).toEqual(true);
        expect(deriveHash(boolModel)).toEqual(true);
        expect(deriveHash(tupleModel)).toEqual(true);
        expect(deriveHash(arrayModel)).toEqual(true);
        expect(deriveHash(enumModel)).toEqual(true);
        expect(deriveHash(unionModel)).toEqual(true);
        expect(deriveHash(objectModel)).toEqual(true);
      });
    });

    describe('deriveEq', () => {
      test('should return false for types that do not implement Eq trait', () => {
        expect(deriveHash(f64Model)).toEqual(false);
        expect(deriveHash(f32Model)).toEqual(false);
        expect(deriveHash(anyModel)).toEqual(false);
      });

      test('should return true for types that implement Eq trait', () => {
        const tupleModel = new ConstrainedTupleModel(
          'test',
          undefined,
          {},
          '',
          [
            new ConstrainedTupleValueModel(0, boolModel),
            new ConstrainedTupleValueModel(1, boolModel)
          ]
        );
        const arrayModel = new ConstrainedArrayModel(
          'test',
          undefined,
          {},
          '',
          i32Model
        );
        const enumModel = new ConstrainedEnumModel('test', undefined, {}, '', [
          new ConstrainedEnumValueModel('one', i32Model, {}),
          new ConstrainedEnumValueModel('two', i32Model, {})
        ]);

        const unionModel = new ConstrainedUnionModel(
          'test',
          undefined,
          {},
          '',
          [i32Model, i64Model, boolModel, tupleModel, arrayModel, enumModel]
        );
        const objectModel = new ConstrainedObjectModel(
          'test',
          undefined,
          {},
          '',
          {
            stringProp: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              stringModel
            ),
            i32Model: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              i32Model
            ),
            i64Model: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              i64Model
            ),
            boolProp: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              boolModel
            ),
            tupleModel: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              tupleModel
            ),
            unionModel: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              unionModel
            ),
            enumModel: new ConstrainedObjectPropertyModel(
              'test',
              'test',
              true,
              enumModel
            )
          }
        );
        expect(deriveEq(stringModel)).toEqual(true);
        expect(deriveEq(i32Model)).toEqual(true);
        expect(deriveEq(i64Model)).toEqual(true);
        expect(deriveEq(boolModel)).toEqual(true);
        expect(deriveEq(tupleModel)).toEqual(true);
        expect(deriveEq(arrayModel)).toEqual(true);
        expect(deriveEq(enumModel)).toEqual(true);
        expect(deriveEq(unionModel)).toEqual(true);
        expect(deriveEq(objectModel)).toEqual(true);
      });
    });
  });
});
