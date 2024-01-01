import { PythonDefaultConstraints } from '../../../../src/generators/python/PythonConstrainer';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ObjectModel,
  ObjectPropertyModel
} from '../../../../src';
import {
  DefaultPropertyKeyConstraints,
  defaultPropertyKeyConstraints,
  PropertyKeyConstraintOptions
} from '../../../../src/generators/python/constrainer/PropertyKeyConstrainer';

describe('PropertyKeyConstrainer', () => {
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
    return PythonDefaultConstraints.propertyKey({
      constrainedObjectModel,
      objectModel,
      objectPropertyModel,
      constrainedObjectPropertyModel
    });
  };

  test('should never render special chars', () => {
    const constrainedKey = constrainPropertyName('%');
    expect(constrainedKey).toEqual('percent');
  });
  test('should not render number as start char', () => {
    const constrainedKey = constrainPropertyName('1');
    expect(constrainedKey).toEqual('number_1');
  });
  test('should never contain empty name', () => {
    const constrainedKey = constrainPropertyName('');
    expect(constrainedKey).toEqual('reservedEmpty');
  });
  test('should use camel naming format', () => {
    const constrainedKey = constrainPropertyName('some weird_value!"#2');
    expect(constrainedKey).toEqual('someWeirdValueExclamationQuotationHash_2');
  });
  test('should not contain duplicate properties', () => {
    const objectModel = new ObjectModel('test', undefined, {}, {});
    const constrainedObjectModel = new ConstrainedObjectModel(
      'test',
      undefined,
      {},
      '',
      {}
    );
    const objectPropertyModel = new ObjectPropertyModel(
      'reservedReturn',
      false,
      objectModel
    );
    const constrainedObjectPropertyModel = new ConstrainedObjectPropertyModel(
      'reservedReturn',
      '',
      objectPropertyModel.required,
      constrainedObjectModel
    );
    const objectPropertyModel2 = new ObjectPropertyModel(
      'return',
      false,
      objectModel
    );
    const constrainedObjectPropertyModel2 = new ConstrainedObjectPropertyModel(
      'return',
      '',
      objectPropertyModel.required,
      constrainedObjectModel
    );
    constrainedObjectModel.properties['reservedReturn'] =
      constrainedObjectPropertyModel;
    constrainedObjectModel.properties['return'] =
      constrainedObjectPropertyModel2;
    const constrainedKey = PythonDefaultConstraints.propertyKey({
      constrainedObjectModel,
      objectModel,
      objectPropertyModel: objectPropertyModel2,
      constrainedObjectPropertyModel: constrainedObjectPropertyModel2
    });
    expect(constrainedKey).toEqual('reservedReservedReturn');
  });
  test('should never render reserved keywords', () => {
    const constrainedKey = constrainPropertyName('return');
    expect(constrainedKey).toEqual('reservedReturn');
  });
  describe('custom constraints', () => {
    test('should be able to overwrite all hooks', () => {
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
      //Expect all callbacks to be called
      for (const jestMockCallback of Object.values(mockedConstraintCallbacks)) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
    test('should be able to overwrite one hooks', () => {
      //All but NAMING_FORMATTER, as we customize that
      const spies = [
        jest.spyOn(DefaultPropertyKeyConstraints, 'NO_SPECIAL_CHAR'),
        jest.spyOn(DefaultPropertyKeyConstraints, 'NO_NUMBER_START_CHAR'),
        jest.spyOn(DefaultPropertyKeyConstraints, 'NO_EMPTY_VALUE'),
        jest.spyOn(DefaultPropertyKeyConstraints, 'NO_RESERVED_KEYWORDS'),
        jest.spyOn(DefaultPropertyKeyConstraints, 'NO_DUPLICATE_PROPERTIES')
      ];
      const overwrittenDefaultFunction = jest.spyOn(
        DefaultPropertyKeyConstraints,
        'NAMING_FORMATTER'
      );
      const jestCallback = jest.fn().mockReturnValue('');
      const constrainFunction = defaultPropertyKeyConstraints({
        NAMING_FORMATTER: jestCallback
      });
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
      const constrainedValue = constrainFunction({
        constrainedObjectModel,
        objectModel,
        objectPropertyModel,
        constrainedObjectPropertyModel
      });
      expect(constrainedValue).toEqual('');
      expect(jestCallback).toHaveBeenCalled();
      expect(overwrittenDefaultFunction).not.toHaveBeenCalled();
      for (const jestMockCallback of spies) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
  });
});
