import { CplusplusDefaultConstraints } from './../../../../src/generators/cplusplus/CplusplusConstrainer';
import { ModelNameConstraints, DefaultModelNameConstraints, defaultModelNameConstraints } from './../../../../src/generators/cplusplus/constrainer/ModelNameConstrainer';

describe('ModelNameConstrainer', () => {
  test('should never render special chars', () => {
    const constrainedKey = CplusplusDefaultConstraints.modelName({
      modelName: '%'
    });
    expect(constrainedKey).toEqual('percent');
  });
  test('should never render number as start char', () => {
    const constrainedKey = CplusplusDefaultConstraints.modelName({
      modelName: '1'
    });
    expect(constrainedKey).toEqual('number_1');
  });
  test('should never contain empty name', () => {
    const constrainedKey = CplusplusDefaultConstraints.modelName({
      modelName: ''
    });
    expect(constrainedKey).toEqual('empty');
  });
  test('should use constant naming format', () => {
    const constrainedKey = CplusplusDefaultConstraints.modelName({
      modelName: 'some weird_value!"#2'
    });
    expect(constrainedKey).toEqual('some_space_weird_value_exclamation_quotation_hash_2');
  });
  test('should never render reserved keywords', () => {
    const constrainedKey = CplusplusDefaultConstraints.modelName({
      modelName: 'return'
    });
    expect(constrainedKey).toEqual('reserved_return');
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
      constrainFunction({ modelName: '' });
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
      const constrainedValue = constrainFunction({ modelName: '' });
      expect(constrainedValue).toEqual('');
      for (const jestMockCallback of spies) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
  });
});