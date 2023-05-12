import { GoDefaultConstraints } from '../../../../src/generators/go/GoConstrainer';
import { EnumModel } from '../../../../src/models/MetaModel';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../../src';
import {
  defaultEnumKeyConstraints,
  ModelEnumKeyConstraints,
  DefaultEnumKeyConstraints
} from '../../../../src/generators/go/constrainer/EnumConstrainer';
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
      const constrainedKey = GoDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '%'
      });
      expect(constrainedKey).toEqual('TestPercent');
    });
    test('should not render number as start char', () => {
      const constrainedKey = GoDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '1'
      });
      expect(constrainedKey).toEqual('TestNumber_1');
    });
    test('should not contain duplicate keys', () => {
      const existingConstrainedEnumValueModel = new ConstrainedEnumValueModel(
        'TestEmpty',
        'TestEmpty',
        'TestEmpty'
      );
      const constrainedEnumModel = new ConstrainedEnumModel(
        'test',
        undefined,
        {},
        '',
        [existingConstrainedEnumValueModel]
      );
      const constrainedKey = GoDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: ''
      });
      expect(constrainedKey).toEqual('TestReservedEmpty');
    });
    test('should never contain empty keys', () => {
      const constrainedKey = GoDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: ''
      });
      expect(constrainedKey).toEqual('TestEmpty');
    });
    test('should use constant naming format', () => {
      const constrainedKey = GoDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: 'some weird_value!"#2'
      });
      expect(constrainedKey).toEqual(
        'TestSomeSpaceWeirdValueExclamationQuotationHash_2'
      );
    });
    test('should never render reserved keywords', () => {
      const constrainedKey = GoDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: 'return'
      });
      expect(constrainedKey).toEqual('TestReservedReturn');
    });
  });
  describe('enum values', () => {
    test('should render string values', () => {
      const constrainedValue = GoDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: 'string value'
      });
      expect(constrainedValue).toEqual('"string value"');
    });
    test('should render boolean values', () => {
      const constrainedValue = GoDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: true
      });
      expect(constrainedValue).toEqual('true');
    });
    test('should render numbers', () => {
      const constrainedValue = GoDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: 123
      });
      expect(constrainedValue).toEqual(123);
    });
    test('should render object', () => {
      const constrainedValue = GoDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: { test: 'test' }
      });
      expect(constrainedValue).toEqual('{"test":"test"}');
    });
    test('should render unknown value', () => {
      const constrainedValue = GoDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: undefined
      });
      expect(constrainedValue).toEqual(undefined);
    });
  });
  describe('custom constraints', () => {
    test('should be able to handle undefined', () => {
      const constrainFunction = defaultEnumKeyConstraints(undefined);
      const value = constrainFunction({
        enumModel,
        constrainedEnumModel,
        enumKey: 'TEST'
      });
      expect(value).toEqual('TestTest');
    });
    test('should be able to overwrite all hooks for enum key', () => {
      const mockedConstraintCallbacks: Partial<ModelEnumKeyConstraints> = {
        NAMING_FORMATTER: jest.fn().mockReturnValue(''),
        NO_SPECIAL_CHAR: jest.fn().mockReturnValue(''),
        NO_NUMBER_START_CHAR: jest.fn().mockReturnValue(''),
        NO_EMPTY_VALUE: jest.fn().mockReturnValue(''),
        NO_RESERVED_KEYWORDS: jest.fn().mockReturnValue('')
      };
      const constrainFunction = defaultEnumKeyConstraints(
        mockedConstraintCallbacks
      );
      constrainFunction({ enumModel, constrainedEnumModel, enumKey: '' });
      //Expect all callbacks to be called
      for (const jestMockCallback of Object.values(mockedConstraintCallbacks)) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
    test('should be able to overwrite one hooks for enum key', () => {
      //All but NAMING_FORMATTER, as we customize that
      const spies = [
        jest.spyOn(DefaultEnumKeyConstraints, 'NO_SPECIAL_CHAR'),
        jest.spyOn(DefaultEnumKeyConstraints, 'NO_NUMBER_START_CHAR'),
        jest.spyOn(DefaultEnumKeyConstraints, 'NO_DUPLICATE_KEYS'),
        jest.spyOn(DefaultEnumKeyConstraints, 'NO_EMPTY_VALUE'),
        jest.spyOn(DefaultEnumKeyConstraints, 'NO_RESERVED_KEYWORDS')
      ];
      const jestCallback = jest.fn().mockReturnValue('');
      const constrainFunction = defaultEnumKeyConstraints({
        NAMING_FORMATTER: jestCallback
      });
      const constrainedValue = constrainFunction({
        enumModel,
        constrainedEnumModel,
        enumKey: ''
      });
      expect(constrainedValue).toEqual('');
      for (const jestMockCallback of spies) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
  });
});
