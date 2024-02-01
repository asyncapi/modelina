import { RustDefaultConstraints } from '../../../../src/generators/rust/RustConstrainer';
import { EnumModel } from '../../../../src/models/MetaModel';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel,
  RustEnumKeyConstraint,
  RustGenerator
} from '../../../../src';
import { defaultEnumKeyConstraints } from '../../../../src/generators/rust/constrainer/EnumConstrainer';
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
      const constrainedKey = RustDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '%',
        options: RustGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('Percent');
    });
    test('should not render number as start char', () => {
      const constrainedKey = RustDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '1',
        options: RustGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('Number_1');
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
      const constrainedKey = RustDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '',
        options: RustGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('Empty');
    });
    test('should never contain empty keys', () => {
      const constrainedKey = RustDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '',
        options: RustGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('Empty');
    });
    test('should use constant naming format', () => {
      const constrainedKey = RustDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: 'some weird_value!"#2',
        options: RustGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual(
        'SomeWeirdValueExclamationQuotationHash_2'
      );
    });
    test('Reserved keywords should not take effect when naming formatter changes its format', () => {
      const constrainedKey = RustDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: 'return',
        options: RustGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('Return');
    });

    describe('custom constraints', () => {
      test('should make sure reserved keywords cannot be rendered', () => {
        const customNamingFormat: Partial<RustEnumKeyConstraint> = {
          NAMING_FORMATTER: (value) => value
        };
        const constrainFunction = defaultEnumKeyConstraints(customNamingFormat);
        const constrainedKey = constrainFunction({
          enumModel,
          constrainedEnumModel,
          enumKey: 'return',
          options: RustGenerator.defaultOptions
        });
        expect(constrainedKey).toEqual('reserved_return');
      });
    });
  });
  describe('enum values', () => {
    test('should render value as is', () => {
      const constrainedValue = RustDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: 'string value',
        options: RustGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual('string value');
    });
    test('should render boolean values', () => {
      const constrainedValue = RustDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: true,
        options: RustGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual(true);
    });
    test('should render numbers', () => {
      const constrainedValue = RustDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: 123,
        options: RustGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual(123);
    });
    test('should render object', () => {
      const constrainedValue = RustDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: { test: 'test' },
        options: RustGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual({ test: 'test' });
    });
    test('should render unknown value', () => {
      const constrainedValue = RustDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: undefined,
        options: RustGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual(undefined);
    });
  });
});
