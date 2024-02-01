import { renderValueFromModel } from '../../../../../src/generators/typescript/presets/utils/ExampleFunction';
import {
  ConstrainedAnyModel,
  ConstrainedArrayModel,
  ConstrainedBooleanModel,
  ConstrainedFloatModel,
  ConstrainedIntegerModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedTupleModel,
  ConstrainedTupleValueModel,
  ConstrainedUnionModel
} from '../../../../../src/models';

describe('Marshalling preset', () => {
  describe('.renderValueFromModel()', () => {
    test('should render refs correctly', () => {
      const refModel = new ConstrainedAnyModel('test', undefined, {}, '');
      const model = new ConstrainedReferenceModel(
        'SomeOtherModel',
        undefined,
        {},
        '',
        refModel
      );
      const output = renderValueFromModel(model);
      expect(output).toEqual('SomeOtherModel.example()');
    });
    test('Should render strings correctly', () => {
      const model = new ConstrainedStringModel('test', undefined, {}, '');
      const output = renderValueFromModel(model);
      expect(output).toEqual('"string"');
    });
    test('Should render numbers correctly', () => {
      const model = new ConstrainedIntegerModel('test', undefined, {}, '');
      const output = renderValueFromModel(model);
      expect(output).toEqual('0');
    });
    test('Should render floating numbers correctly', () => {
      const model = new ConstrainedFloatModel('test', undefined, {}, '');
      const output = renderValueFromModel(model);
      expect(output).toEqual('0.0');
    });
    test('Should render booleans correctly', () => {
      const model = new ConstrainedBooleanModel('test', undefined, {}, '');
      const output = renderValueFromModel(model);
      expect(output).toEqual('true');
    });
    test('Should use first value if there is more then one', () => {
      const unionModel = new ConstrainedBooleanModel('test', undefined, {}, '');
      const model = new ConstrainedUnionModel('test', undefined, {}, '', [
        unionModel
      ]);
      const output = renderValueFromModel(model);
      expect(output).toEqual('true');
    });
    test('Should render array value', () => {
      const arrayModel = new ConstrainedBooleanModel('test', undefined, {}, '');
      const model = new ConstrainedArrayModel(
        'test',
        undefined,
        {},
        '',
        arrayModel
      );
      const output = renderValueFromModel(model);
      expect(output).toEqual('[true]');
    });
    test('Should handle unknown types', () => {
      const model = new ConstrainedAnyModel('test', undefined, {}, '');
      const output = renderValueFromModel(model);
      expect(output).toEqual(undefined);
    });
    describe('tuples', () => {
      test('should not render anything if no items are defined', () => {
        const model = new ConstrainedTupleModel('test', undefined, {}, '', []);
        const output = renderValueFromModel(model);
        expect(output).toEqual(undefined);
      });
      test('should render multiple array values', () => {
        const stringModel = new ConstrainedStringModel(
          'test',
          undefined,
          {},
          'String'
        );
        const tupleValueModel1 = new ConstrainedTupleValueModel(0, stringModel);
        const integerModel = new ConstrainedIntegerModel(
          'test',
          undefined,
          {},
          ''
        );
        const tupleValueModel2 = new ConstrainedTupleValueModel(
          0,
          integerModel
        );
        const model = new ConstrainedTupleModel('test', undefined, {}, '', [
          tupleValueModel1,
          tupleValueModel2
        ]);
        const output = renderValueFromModel(model);
        expect(output).toEqual('["string",0]');
      });
      test('should render single array value', () => {
        const stringModel = new ConstrainedStringModel(
          'test',
          undefined,
          {},
          'String'
        );
        const tupleValueModel = new ConstrainedTupleValueModel(0, stringModel);
        const model = new ConstrainedTupleModel('test', undefined, {}, '', [
          tupleValueModel
        ]);
        const output = renderValueFromModel(model);
        expect(output).toEqual('["string"]');
      });
    });
  });
});
