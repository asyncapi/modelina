import { PhpDefaultConstraints } from '../../../../src/generators/php/PhpConstrainer';
import { EnumModel } from '../../../../src/models/MetaModel';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../../src';
import {
  defaultEnumKeyConstraints,
  ModelEnumKeyConstraints
} from '../../../../src/generators/php/constrainer/EnumConstrainer';

describe('Php EnumConstrainer', () => {
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
      const constrainedKey = PhpDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '%'
      });
      expect(constrainedKey).toEqual('PERCENT');
    });

    test('should not render number as start char', () => {
      const constrainedKey = PhpDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: '1'
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
      const constrainedKey = PhpDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: ''
      });
      expect(constrainedKey).toEqual('RESERVED_EMPTY');
    });

    test('should never contain empty keys', () => {
      const constrainedKey = PhpDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: ''
      });
      expect(constrainedKey).toEqual('RESERVED_EMPTY');
    });

    test('should use constant naming format', () => {
      const constrainedKey = PhpDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: 'some weird_value!"#2'
      });
      expect(constrainedKey).toEqual(
        'SOME_WEIRD_VALUE_EXCLAMATION_QUOTATION_HASH_2'
      );
    });

    test('should never render reserved keywords', () => {
      const constrainedKey = PhpDefaultConstraints.enumKey({
        enumModel,
        constrainedEnumModel,
        enumKey: 'return'
      });
      expect(constrainedKey).toEqual('RESERVED_RETURN');
    });
  });

  describe('enum values', () => {
    test('should render string values', () => {
      const constrainedValue = PhpDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: 'string value'
      });
      expect(constrainedValue).toEqual('"string value"');
    });
    test('should render boolean values', () => {
      const constrainedBooleanValue = PhpDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: true
      });
      expect(constrainedBooleanValue).toEqual('"true"');
    });

    test('should render numbers', () => {
      const constrainedNumberValue = PhpDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: 123
      });
      expect(constrainedNumberValue).toEqual(123);
    });

    test('should render object values', () => {
      const constrainedObjectValue = PhpDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: { test: 'test' }
      });
      expect(constrainedObjectValue).toEqual('"{\\"test\\":\\"test\\"}"');
    });

    test('should render unknown value', () => {
      const constrainedUnknownValue = PhpDefaultConstraints.enumValue({
        enumModel,
        constrainedEnumModel,
        enumValue: undefined
      });
      expect(constrainedUnknownValue).toEqual(`"undefined"`);
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
      constrainFunction({ enumModel, constrainedEnumModel, enumKey: '' });
      for (const jestMockCallback of Object.values(mockedConstraintCallbacks)) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
    test('should be able to overwrite specific hooks for enum key', () => {
      const mockedConstraintCallbacks: Partial<ModelEnumKeyConstraints> = {
        NAMING_FORMATTER: jest.fn().mockReturnValue('')
      };
      const constrainFunction = defaultEnumKeyConstraints(
        mockedConstraintCallbacks
      );
      constrainFunction({ enumModel, constrainedEnumModel, enumKey: '' });

      expect(mockedConstraintCallbacks.NAMING_FORMATTER).toHaveBeenCalled();
    });
  });
});
