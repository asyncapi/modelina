import { TypeScriptGenerator } from '../../../../src';
import { TypeScriptDefaultConstraints } from '../../../../src/generators/typescript/TypeScriptConstrainer';
import {
  DefaultModelNameConstraints,
  defaultModelNameConstraints,
  ModelNameConstraints
} from '../../../../src/generators/typescript/constrainer/ModelNameConstrainer';
describe('ModelNameConstrainer', () => {
  test('should never render special chars', () => {
    const constrainedKey = TypeScriptDefaultConstraints.modelName({
      modelName: '%',
      options: TypeScriptGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Percent');
  });
  test('should never render number as start char', () => {
    const constrainedKey = TypeScriptDefaultConstraints.modelName({
      modelName: '1',
      options: TypeScriptGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Number_1');
  });
  test('should never contain empty name', () => {
    const constrainedKey = TypeScriptDefaultConstraints.modelName({
      modelName: '',
      options: TypeScriptGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('Empty');
  });
  test('should use constant naming format', () => {
    const constrainedKey = TypeScriptDefaultConstraints.modelName({
      modelName: 'some weird_value!"#2',
      options: TypeScriptGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('SomeWeirdValueExclamationQuotationHash_2');
  });
  test('should never render reserved keywords', () => {
    const constrainedKey = TypeScriptDefaultConstraints.modelName({
      modelName: 'return',
      options: TypeScriptGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('ReservedReturn');
  });
  test('should never render reserved JS keywords by default', () => {
    const constrainedKey = TypeScriptDefaultConstraints.modelName({
      modelName: 'location',
      options: {
        ...TypeScriptGenerator.defaultOptions,
        useJavascriptReservedKeywords: true
      }
    });
    expect(constrainedKey).toEqual('ReservedLocation');
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
        options: TypeScriptGenerator.defaultOptions
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
        options: TypeScriptGenerator.defaultOptions
      });
      expect(constrainedValue).toEqual('');
      for (const jestMockCallback of spies) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
  });
});
