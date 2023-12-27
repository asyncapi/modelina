import { PhpDefaultConstraints } from '../../../../src/generators/php/PhpConstrainer';
import {
  ConstrainedObjectModel,
  ObjectModel,
  ConstrainedObjectPropertyModel,
  ObjectPropertyModel
} from '../../../../src';
import {
  DefaultPropertyKeyConstraints,
  defaultPropertyKeyConstraints,
  PropertyKeyConstraintOptions
} from '../../../../src/generators/php/constrainer/PropertyKeyConstrainer';

describe('PropertyKeyConstrainer for PHP', () => {
  const objectModel = new ObjectModel('test', undefined, {}, {});
  const constrainedObjectModel = new ConstrainedObjectModel(
    'test',
    undefined,
    {},
    '',
    {}
  );

  const constrainPropertyName = (propertyName: string) => {
    const objectPropertyModel = new ObjectPropertyModel(
      propertyName,
      false,
      objectModel
    );
    const constrainedObjectPropertyModel = new ConstrainedObjectPropertyModel(
      '',
      '',
      objectPropertyModel.required,
      constrainedObjectModel
    );
    return PhpDefaultConstraints.propertyKey({
      constrainedObjectModel,
      objectModel,
      objectPropertyModel,
      constrainedObjectPropertyModel
    });
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should never render special chars for PHP', () => {
    const constrainedKey = constrainPropertyName('%');
    expect(constrainedKey).toEqual('percent');
  });

  test('should not render number as start char for PHP', () => {
    const constrainedKey = constrainPropertyName('1');
    expect(constrainedKey).toEqual('number_1');
  });

  test('should never contain empty name for PHP', () => {
    const constrainedKey = constrainPropertyName('');
    expect(constrainedKey).toEqual('reservedEmpty');
  });

  test('should use camelCase naming format for PHP', () => {
    const constrainedKey = constrainPropertyName('some weird_value!"#2');
    expect(constrainedKey).toEqual('someWeirdValueExclamationQuotationHash_2');
  });

  test('should never render reserved keywords for PHP', () => {
    const constrainedKey = constrainPropertyName('return');
    expect(constrainedKey).toEqual('reservedReturn');
  });

  describe('custom constraints for PHP', () => {
    test('should be able to overwrite all hooks for PHP', () => {
      const mockedConstraintCallbacks: Partial<PropertyKeyConstraintOptions> = {
        NAMING_FORMATTER: jest.fn().mockReturnValue(''),
        NO_SPECIAL_CHAR: jest.fn().mockReturnValue(''),
        NO_NUMBER_START_CHAR: jest.fn().mockReturnValue(''),
        NO_EMPTY_VALUE: jest.fn().mockReturnValue(''),
        NO_RESERVED_KEYWORDS: jest.fn().mockReturnValue('')
      };
      const constrainFunction = defaultPropertyKeyConstraints(
        mockedConstraintCallbacks
      );
      const objectPropertyModel = new ObjectPropertyModel(
        '',
        false,
        objectModel
      );
      const constrainedObjectPropertyModel = new ConstrainedObjectPropertyModel(
        '',
        '',
        objectPropertyModel.required,
        constrainedObjectModel
      );
      constrainFunction({
        constrainedObjectModel,
        objectModel,
        objectPropertyModel,
        constrainedObjectPropertyModel
      });
      for (const jestMockCallback of Object.values(mockedConstraintCallbacks)) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
    test('should be able to overwrite NO_SPECIAL_CHAR hook for PHP', () => {
      const mockedConstraintCallbacks: Partial<PropertyKeyConstraintOptions> = {
        NO_SPECIAL_CHAR: jest.fn().mockImplementation((value: string) => {
          return value.replace(/[@#$%^&*]/g, '');
        }),
        NAMING_FORMATTER: jest.fn().mockReturnValue(''),
        NO_NUMBER_START_CHAR: jest.fn().mockReturnValue(''),
        NO_EMPTY_VALUE: jest.fn().mockReturnValue(''),
        NO_RESERVED_KEYWORDS: jest.fn().mockReturnValue('')
      };

      const constrainFunction = defaultPropertyKeyConstraints(
        mockedConstraintCallbacks
      );

      const objectPropertyModel = new ObjectPropertyModel(
        '',
        false,
        objectModel
      );
      const constrainedObjectPropertyModel = new ConstrainedObjectPropertyModel(
        '',
        '',
        objectPropertyModel.required,
        constrainedObjectModel
      );

      const result = constrainFunction({
        constrainedObjectModel,
        objectModel,
        objectPropertyModel,
        constrainedObjectPropertyModel
      });
      expect(result).toEqual('');
      expect(mockedConstraintCallbacks.NO_SPECIAL_CHAR).toHaveBeenCalled();
    });

    test('should be able to overwrite NO_EMPTY_VALUE hook for PHP', () => {
      const mockedConstraintCallbacks: Partial<PropertyKeyConstraintOptions> = {
        NO_EMPTY_VALUE: jest.fn().mockImplementation((value: string) => {
          return value.trim();
        }),
        NAMING_FORMATTER: jest.fn().mockReturnValue(''),
        NO_SPECIAL_CHAR: jest.fn().mockReturnValue(''),
        NO_NUMBER_START_CHAR: jest.fn().mockReturnValue(''),
        NO_RESERVED_KEYWORDS: jest.fn().mockReturnValue('')
      };

      const constrainFunction = defaultPropertyKeyConstraints(
        mockedConstraintCallbacks
      );

      const objectPropertyModel = new ObjectPropertyModel(
        '',
        false,
        objectModel
      );
      const constrainedObjectPropertyModel = new ConstrainedObjectPropertyModel(
        '',
        '',
        objectPropertyModel.required,
        constrainedObjectModel
      );

      const result = constrainFunction({
        constrainedObjectModel,
        objectModel,
        objectPropertyModel,
        constrainedObjectPropertyModel
      });
      expect(result).toEqual('');
      expect(mockedConstraintCallbacks.NO_EMPTY_VALUE).toHaveBeenCalled();
    });
  });
});
