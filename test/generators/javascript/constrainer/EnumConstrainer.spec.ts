import { JavaScriptDefaultConstraints } from '../../../../src/generators/javascript/JavaScriptConstrainer';
import { EnumModel } from '../../../../src/models/MetaModel';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../../src';
describe('EnumConstrainer', () => {
  const enumModel = new EnumModel('test', undefined, {}, []);
  const constrainedEnumModel = new ConstrainedEnumModel(
    'test',
    undefined,
    {},
    '',
    []
  );

  describe('enum keys', () => {
    test('should never render special chars', () => {
      const constrainedKey = JavaScriptDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '%'
      });
      expect(constrainedKey).toEqual('%');
    });
    test('should not render number as start char', () => {
      const constrainedKey = JavaScriptDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '1'
      });
      expect(constrainedKey).toEqual('1');
    });
    test('should not contain duplicate keys', () => {
      const existingConstrainedEnumValueModel = new ConstrainedEnumValueModel(
        'EMPTY',
        'return',
        'return'
      );
      const constrainedEnumModel = new ConstrainedEnumModel(
        'test',
        undefined,
        {},
        '',
        [existingConstrainedEnumValueModel]
      );
      const constrainedKey = JavaScriptDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: ''
      });
      expect(constrainedKey).toEqual('');
    });
    test('should never contain empty keys', () => {
      const constrainedKey = JavaScriptDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: ''
      });
      expect(constrainedKey).toEqual('');
    });
    test('should use constant naming format', () => {
      const constrainedKey = JavaScriptDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: 'some weird_value!"#2'
      });
      expect(constrainedKey).toEqual('some weird_value!"#2');
    });
    test('should never render reserved keywords', () => {
      const constrainedKey = JavaScriptDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: 'return'
      });
      expect(constrainedKey).toEqual('return');
    });
  });
  describe('enum values', () => {
    test('should render value as is', () => {
      const constrainedValue = JavaScriptDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: 'string value'
      });
      expect(constrainedValue).toEqual('string value');
    });
    test('should render boolean values', () => {
      const constrainedValue = JavaScriptDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: true
      });
      expect(constrainedValue).toEqual(true);
    });
    test('should render numbers', () => {
      const constrainedValue = JavaScriptDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: 123
      });
      expect(constrainedValue).toEqual(123);
    });
    test('should render object', () => {
      const constrainedValue = JavaScriptDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: { test: 'test' }
      });
      expect(constrainedValue).toEqual({ test: 'test' });
    });
    test('should render unknown value', () => {
      const constrainedValue = JavaScriptDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: undefined
      });
      expect(constrainedValue).toEqual(undefined);
    });
  });
});
