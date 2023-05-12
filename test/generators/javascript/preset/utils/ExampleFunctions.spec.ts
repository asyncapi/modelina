import { renderValueFromModel } from '../../../../../src/generators/javascript/presets/utils/ExampleFunction';
import {
  CommonModel,
  ConstrainedAnyModel,
  ConstrainedArrayModel,
  ConstrainedBooleanModel,
  ConstrainedIntegerModel,
  ConstrainedReferenceModel,
  ConstrainedStringModel,
  ConstrainedTupleModel,
  ConstrainedTupleValueModel,
  ConstrainedUnionModel
} from '../../../../../src/models';
describe('Example preset', () => {
  describe('.renderValueFromModel()', () => {
    test('should render refs correctly', () => {
      const refModel = new ConstrainedAnyModel(
        'SomeOtherModel',
        undefined,
        {},
        'SomeOtherModel'
      );
      const model = new ConstrainedReferenceModel(
        'test',
        undefined,
        {},
        '',
        refModel
      );
      const output = renderValueFromModel(model);
      expect(output).toEqual('SomeOtherModel.example()');
    });
    describe('types', () => {
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
      test('Should render booleans correctly', () => {
        const model = new ConstrainedBooleanModel('test', undefined, {}, '');
        const output = renderValueFromModel(model);
        expect(output).toEqual('true');
      });
      test('Should use first value if there is more then one', () => {
        const stringModel = new ConstrainedStringModel(
          'test',
          undefined,
          {},
          ''
        );
        const booleanModel = new ConstrainedBooleanModel(
          'test',
          undefined,
          {},
          ''
        );
        const model = new ConstrainedUnionModel('test', undefined, {}, '', [
          booleanModel,
          stringModel
        ]);
        const output = renderValueFromModel(model);
        expect(output).toEqual('true');
      });
      describe('array', () => {
        test('should render multiple array values', () => {
          const stringModel = new ConstrainedStringModel(
            'test',
            undefined,
            {},
            ''
          );
          const integerModel = new ConstrainedIntegerModel(
            'test',
            undefined,
            {},
            ''
          );
          const model = new ConstrainedTupleModel('test', undefined, {}, '', [
            new ConstrainedTupleValueModel(0, stringModel),
            new ConstrainedTupleValueModel(1, integerModel)
          ]);
          const output = renderValueFromModel(model);
          expect(output).toEqual('["string", 0]');
        });
        test('should render single array value', () => {
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
          const output = renderValueFromModel(model);
          expect(output).toEqual('["string"]');
        });
      });
      test('Should ignore if none are present', () => {
        const model = new ConstrainedAnyModel('test', undefined, {}, '');
        const output = renderValueFromModel(model);
        expect(output).toBeUndefined();
      });
    });
  });
});
