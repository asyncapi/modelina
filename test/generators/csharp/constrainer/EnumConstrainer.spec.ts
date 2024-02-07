import { CSharpDefaultConstraints } from '../../../../src/generators/csharp/CSharpConstrainer';
import { EnumModel } from '../../../../src/models/MetaModel';
import {
  CSharpGenerator,
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../../src';
import {
  defaultEnumKeyConstraints,
  ModelEnumKeyConstraints,
  DefaultEnumKeyConstraints
} from '../../../../src/generators/csharp/constrainer/EnumConstrainer';
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
      const constrainedKey = CSharpDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '%',
        options: CSharpGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('PERCENT');
    });
    test('should not render number as start char', () => {
      const constrainedKey = CSharpDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '1',
        options: CSharpGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('NUMBER_1');
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
      const constrainedKey = CSharpDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '',
        options: CSharpGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('RESERVED_EMPTY');
    });
    test('should never contain empty keys', () => {
      const constrainedKey = CSharpDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '',
        options: CSharpGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('EMPTY');
    });
    test('should use constant naming format', () => {
      const constrainedKey = CSharpDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: 'some weird_value!"#2',
        options: CSharpGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual(
        'SOME_SPACE_WEIRD_VALUE_EXCLAMATION_QUOTATION_HASH_2'
      );
    });
    test('should never render reserved keywords', () => {
      const constrainedKey = CSharpDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: 'return',
        options: CSharpGenerator.defaultOptions
      });
      expect(constrainedKey).toEqual('RESERVED_RETURN');
    });
  });
  describe('enum values', () => {
    test('should render string values', () => {
      const constrainedValue = CSharpDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: 'string value',
        options: CSharpGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual('"string value"');
    });
    test('should render boolean values', () => {
      const constrainedValue = CSharpDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: true,
        options: CSharpGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual(true);
    });
    test('should render numbers', () => {
      const constrainedValue = CSharpDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: 123,
        options: CSharpGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual(123);
    });
    test('should render object', () => {
      const constrainedValue = CSharpDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: { test: 'test' },
        options: CSharpGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual('"{\\"test\\":\\"test\\"}"');
    });
    test('should render unknown value', () => {
      const constrainedValue = CSharpDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: undefined,
        options: CSharpGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual('"undefined"');
    });
  });
  describe('custom constraints', () => {
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
      constrainFunction({
        enumModel,
        constrainedEnumModel,
        enumKey: '',
        options: CSharpGenerator.defaultOptions
      });
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
        enumKey: '',
        options: CSharpGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual('');
      for (const jestMockCallback of spies) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
  });
});
