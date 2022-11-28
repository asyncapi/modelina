import { RustDefaultConstraints } from '../../../../src/generators/rust/RustConstrainer';
import { EnumModel } from '../../../../src/models/MetaModel';
import { ConstrainedEnumModel, ConstrainedEnumValueModel } from '../../../../src';
describe('EnumConstrainer', () => {
  const enumModel = new EnumModel('test', undefined, []);
  const constrainedEnumModel = new ConstrainedEnumModel('test', undefined, '', []);

  describe('enum keys', () => {
    test('should never render special chars', () => {
      const constrainedKey = RustDefaultConstraints.enumKey({enumModel, constrainedEnumModel, enumKey: '%'});
      expect(constrainedKey).toEqual('Percent');
    });
    test('should not render number as start char', () => {
      const constrainedKey = RustDefaultConstraints.enumKey({enumModel, constrainedEnumModel, enumKey: '1'});
      expect(constrainedKey).toEqual('Number_1');
    });
    test('should not contain duplicate keys', () => {
      const existingConstrainedEnumValueModel = new ConstrainedEnumValueModel('EMPTY', 'return');
      const constrainedEnumModel = new ConstrainedEnumModel('test', undefined, '', [existingConstrainedEnumValueModel]);
      const constrainedKey = RustDefaultConstraints.enumKey({enumModel, constrainedEnumModel, enumKey: ''});
      expect(constrainedKey).toEqual('Empty');
    });
    test('should never contain empty keys', () => {
      const constrainedKey = RustDefaultConstraints.enumKey({enumModel, constrainedEnumModel, enumKey: ''});
      expect(constrainedKey).toEqual('Empty');
    });
    test('should use constant naming format', () => {
      const constrainedKey = RustDefaultConstraints.enumKey({enumModel, constrainedEnumModel, enumKey: 'some weird_value!"#2'});
      expect(constrainedKey).toEqual('SomeWeirdValueExclamationQuotationHash_2');
    });
    test('should never render reserved keywords', () => {
      const constrainedKey = RustDefaultConstraints.enumKey({enumModel, constrainedEnumModel, enumKey: 'return'});
      expect(constrainedKey).toEqual('ReservedReturn');
    });
  });
  describe('enum values', () => {
    test('should render value as is', () => {
      const constrainedValue = RustDefaultConstraints.enumValue({enumModel, constrainedEnumModel, enumValue: 'string value'});
      expect(constrainedValue).toEqual('string value');
    });
    test('should render boolean values', () => {
      const constrainedValue = RustDefaultConstraints.enumValue({enumModel, constrainedEnumModel, enumValue: true});
      expect(constrainedValue).toEqual(true);
    });
    test('should render numbers', () => {
      const constrainedValue = RustDefaultConstraints.enumValue({enumModel, constrainedEnumModel, enumValue: 123});
      expect(constrainedValue).toEqual(123);
    });
    test('should render object', () => {
      const constrainedValue = RustDefaultConstraints.enumValue({enumModel, constrainedEnumModel, enumValue: {test: 'test'}});
      expect(constrainedValue).toEqual({test: 'test'});
    });
    test('should render unknown value', () => {
      const constrainedValue = RustDefaultConstraints.enumValue({enumModel, constrainedEnumModel, enumValue: undefined});
      expect(constrainedValue).toEqual(undefined);
    });
  });
});
