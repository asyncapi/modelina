import { GoGenerator } from '../../../../src';
import { GoDefaultConstraints } from '../../../../src/generators/go/GoConstrainer';
import {
  DefaultModelNameConstraints,
  defaultModelNameConstraints,
  ModelNameConstraints
} from '../../../../src/generators/go/constrainer/ModelNameConstrainer';
describe('ModelNameConstrainer', () => {
  test('should never render special chars', () => {
    const constrainedKey = GoDefaultConstraints.modelName({
      modelName: '%',
      options: GoGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Percent');
  });
  test('should never render number as start char', () => {
    const constrainedKey = GoDefaultConstraints.modelName({
      modelName: '1',
      options: GoGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Number_1');
  });
  test('should never contain empty name', () => {
    const constrainedKey = GoDefaultConstraints.modelName({
      modelName: '',
      options: GoGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Empty');
  });
  test('should use constant naming format', () => {
    const constrainedKey = GoDefaultConstraints.modelName({
      modelName: 'some weird_value!"#2',
      options: GoGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('SomeWeirdValueExclamationQuotationHash_2');
  });
  test('should never render reserved keywords', () => {
    const constrainedKey = GoDefaultConstraints.modelName({
      modelName: 'return',
      options: GoGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('ReservedReturn');
  });
  describe('custom constraints', () => {
    test('should be able to overwrite all hooks', () => {
      const mockedConstraintCallbacks: ModelNameConstraints = {
        NAMING_FORMATTER: jest.fn().mockReturnValue(''),
        NO_SPECIAL_CHAR: jest.fn().mockReturnValue(''),
        NO_NUMBER_START_CHAR: jest.fn().mockReturnValue(''),
        NO_EMPTY_VALUE: jest.fn().mockReturnValue(''),
        NO_RESERVED_KEYWORDS: jest.fn().mockReturnValue('')
      };
      const constrainFunction = defaultModelNameConstraints(
        mockedConstraintCallbacks
      );
      constrainFunction({
        modelName: '',
        options: GoGenerator.defaultOptions
      });
      //Expect all callbacks to be called
      for (const jestMockCallback of Object.values(mockedConstraintCallbacks)) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
    test('should be able to overwrite one hooks', () => {
      //All but NAMING_FORMATTER, as we customize that
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
      const constrainedValue = constrainFunction({
        modelName: '',
        options: GoGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual('');
      for (const jestMockCallback of spies) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
  });
});
