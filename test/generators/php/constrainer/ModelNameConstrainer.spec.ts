import {
  DefaultModelNameConstraints,
  defaultModelNameConstraints,
  ModelNameConstraints
} from '../../../../src/generators/php/constrainer/ModelNameConstrainer';

describe('PHP ModelNameConstrainer', () => {
  const PhpDefaultConstraints: ModelNameConstraints =
    DefaultModelNameConstraints;

  test('should replace special characters with underscores', () => {
    const constrainedName = PhpDefaultConstraints.NO_SPECIAL_CHAR('name%$test');
    expect(constrainedName).toEqual('name_percent_dollar_test');
  });

  test('should handle number start characters', () => {
    const constrainedName = PhpDefaultConstraints.NO_NUMBER_START_CHAR('1Test');
    expect(constrainedName).toEqual('number_1Test');
  });

  test('should handle empty value by default', () => {
    const constrainedName = PhpDefaultConstraints.NO_EMPTY_VALUE('');
    expect(constrainedName).toEqual('empty');
  });

  test('should convert to PascalCase by default', () => {
    const constrainedName = PhpDefaultConstraints.NAMING_FORMATTER('test_name');
    expect(constrainedName).toEqual('TestName');
  });

  test('should handle reserved PHP keywords', () => {
    const constrainedName =
      PhpDefaultConstraints.NO_RESERVED_KEYWORDS('return');
    expect(constrainedName).toEqual('reserved_return');
  });

  describe('Custom PHP constraints', () => {
    test('should be able to overwrite all hooks for PHP', () => {
      const mockedConstraintCallbacks: Partial<ModelNameConstraints> = {
        NAMING_FORMATTER: jest.fn().mockReturnValue(''),
        NO_SPECIAL_CHAR: jest.fn().mockReturnValue(''),
        NO_NUMBER_START_CHAR: jest.fn().mockReturnValue(''),
        NO_EMPTY_VALUE: jest.fn().mockReturnValue(''),
        NO_RESERVED_KEYWORDS: jest.fn().mockReturnValue('')
      };
      const constrainFunction = defaultModelNameConstraints(
        mockedConstraintCallbacks
      );
      constrainFunction({ modelName: '' });
      // Expect all callbacks to be called
      for (const jestMockCallback of Object.values(mockedConstraintCallbacks)) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });

    test('should be able to overwrite one hook for PHP', () => {
      // All but NAMING_FORMATTER, as we customize that
      const spies = [
        jest.spyOn(DefaultModelNameConstraints, 'NO_SPECIAL_CHAR'),
        jest.spyOn(DefaultModelNameConstraints, 'NO_NUMBER_START_CHAR'),
        jest.spyOn(DefaultModelNameConstraints, 'NO_EMPTY_VALUE'),
        jest.spyOn(DefaultModelNameConstraints, 'NO_RESERVED_KEYWORDS')
      ];
      const jestCallback = jest.fn().mockReturnValue('');
      const constrainFunction = defaultModelNameConstraints({
        NAMING_FORMATTER: jestCallback
      });
      const constrainedValue = constrainFunction({ modelName: '' });
      expect(constrainedValue).toEqual('');
      for (const jestMockCallback of spies) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
  });
});
