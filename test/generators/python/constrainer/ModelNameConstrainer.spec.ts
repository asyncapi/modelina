import { PythonGenerator } from '../../../../src';
import { PythonDefaultConstraints } from '../../../../src/generators/python/PythonConstrainer';
import {
  DefaultModelNameConstraints,
  defaultModelNameConstraints,
  ModelNameConstraints
} from '../../../../src/generators/python/constrainer/ModelNameConstrainer';

describe('ModelNameConstrainer', () => {
  test('should never render special chars', () => {
    const constrainedKey = PythonDefaultConstraints.modelName({
      modelName: '%',
      options: PythonGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Percent');
  });
  test('should never render number as start char', () => {
    const constrainedKey = PythonDefaultConstraints.modelName({
      modelName: '1',
      options: PythonGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Number1');
  });
  test('should never contain empty name', () => {
    const constrainedKey = PythonDefaultConstraints.modelName({
      modelName: '',
      options: PythonGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Empty');
  });
  test('should use pascal naming format', () => {
    const constrainedKey = PythonDefaultConstraints.modelName({
      modelName: 'some weird_value!"#2',
      options: PythonGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('SomeWeirdValueExclamationQuotationHash2');
  });
  test('should never render reserved keywords', () => {
    const constrainedKey = PythonDefaultConstraints.modelName({
      modelName: 'return',
      options: PythonGenerator.defaultOptions
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
        options: PythonGenerator.defaultOptions
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
        options: PythonGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual('');
      for (const jestMockCallback of spies) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
  });
});
