import { JavaScriptDefaultConstraints } from '../../../../src/generators/javascript/JavaScriptConstrainer';
import { EnumModel } from '../../../../src/models/MetaModel';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel,
  JavaScriptGenerator
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
        enumKey: '%',
        options: JavaScriptGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('%');
    });
    test('should not render number as start char', () => {
      const constrainedKey = JavaScriptDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '1',
        options: JavaScriptGenerator.defaultOptions
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
        enumKey: '',
        options: JavaScriptGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('');
    });
    test('should never contain empty keys', () => {
      const constrainedKey = JavaScriptDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '',
        options: JavaScriptGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('');
    });
    test('should use pascal naming format', () => {
      const constrainedKey = JavaScriptDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: 'some weird_value!"#2',
        options: JavaScriptGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('some weird_value!"#2');
    });
    test('should never render reserved keywords', () => {
      const constrainedKey = JavaScriptDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: 'return',
        options: JavaScriptGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('return');
    });
  });
  describe('enum values', () => {
    test('should render value as is', () => {
      const constrainedValue = JavaScriptDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: 'string value',
        options: JavaScriptGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual('string value');
    });
    test('should render boolean values', () => {
      const constrainedValue = JavaScriptDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: true,
        options: JavaScriptGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual(true);
    });
    test('should render numbers', () => {
      const constrainedValue = JavaScriptDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: 123,
        options: JavaScriptGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual(123);
    });
    test('should render object', () => {
      const constrainedValue = JavaScriptDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: { test: 'test' },
        options: JavaScriptGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual({ test: 'test' });
    });
    test('should render unknown value', () => {
      const constrainedValue = JavaScriptDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: undefined,
        options: JavaScriptGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual(undefined);
    });
  });
});
