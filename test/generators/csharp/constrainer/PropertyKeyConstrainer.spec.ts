import { CSharpDefaultConstraints } from '../../../../src/generators/csharp/CSharpConstrainer';
import { ConstrainedObjectModel, ConstrainedObjectPropertyModel, ObjectModel, ObjectPropertyModel } from '../../../../src';
import { DefaultPropertyKeyConstraints, defaultPropertyKeyConstraints, PropertyKeyConstraintOptions } from '../../../../src/generators/csharp/constrainer/PropertyKeyConstrainer';
describe('PropertyKeyConstrainer', () => {
  const objectModel = new ObjectModel('test', undefined, {});
  const constrainedObjectModel = new ConstrainedObjectModel('test', undefined, '', {});

  const constrainPropertyName = (propertyName: string) => {
    const objectPropertyModel = new ObjectPropertyModel(propertyName, false, objectModel);
    const constrainedObjectPropertyModel = new ConstrainedObjectPropertyModel('', '', objectPropertyModel.required, constrainedObjectModel);
    return CSharpDefaultConstraints.propertyKey({constrainedObjectModel, objectModel, objectPropertyModel, constrainedObjectPropertyModel });
  };

  test('should never render special chars', () => {
    const constrainedKey = constrainPropertyName('%');
    expect(constrainedKey).toEqual('Percent');
  });
  test('should not render number as start char', () => {
    const constrainedKey = constrainPropertyName('1');
    expect(constrainedKey).toEqual('Number_1');
  });
  test('should never contain empty name', () => {
    const constrainedKey = constrainPropertyName('');
    expect(constrainedKey).toEqual('Empty');
  });
  test('should use constant naming format', () => {
    const constrainedKey = constrainPropertyName('some weird_value!"#2');
    expect(constrainedKey).toEqual('SomeWeirdValueExclamationQuotationHash_2');
  });
  test('should not contain duplicate properties', () => {
    const objectModel = new ObjectModel('test', undefined, {});
    const constrainedObjectModel = new ConstrainedObjectModel('test', undefined, '', {});
    const objectPropertyModel = new ObjectPropertyModel('SomeProperty', false, objectModel);
    const constrainedObjectPropertyModel = new ConstrainedObjectPropertyModel('SomeProperty', 'SomeProperty', objectPropertyModel.required, constrainedObjectModel);
    constrainedObjectModel.properties['SomeProperty'] = constrainedObjectPropertyModel;
    const constrainedKey = CSharpDefaultConstraints.propertyKey({constrainedObjectModel, objectModel, objectPropertyModel, constrainedObjectPropertyModel});
    expect(constrainedKey).toEqual('ReservedSomeProperty');
  });
  test('should never render reserved keywords', () => {
    const constrainedKey = constrainPropertyName('return');
    expect(constrainedKey).toEqual('ReservedReturn');
  });
  describe('custom constraints', () => {
    test('should be able to overwrite all hooks', () => {
      const mockedConstraintCallbacks: PropertyKeyConstraintOptions = {
        NAMING_FORMATTER: jest.fn().mockReturnValue(''),
        NO_SPECIAL_CHAR: jest.fn().mockReturnValue(''),
        NO_NUMBER_START_CHAR: jest.fn().mockReturnValue(''),
        NO_EMPTY_VALUE: jest.fn().mockReturnValue(''),
        NO_RESERVED_KEYWORDS: jest.fn().mockReturnValue(''),
        NO_DUPLICATE_PROPERTIES: jest.fn().mockReturnValue('')
      };
      const constrainFunction = defaultPropertyKeyConstraints(mockedConstraintCallbacks);
      const objectPropertyModel = new ObjectPropertyModel('', false, objectModel);
      const constrainedObjectPropertyModel = new ConstrainedObjectPropertyModel('', '', objectPropertyModel.required, constrainedObjectModel);
      constrainFunction({constrainedObjectModel, objectModel, objectPropertyModel, constrainedObjectPropertyModel});
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
      const jestCallback = jest.fn().mockReturnValue('');
      const constrainFunction = defaultPropertyKeyConstraints({NAMING_FORMATTER: jestCallback});
      const objectPropertyModel = new ObjectPropertyModel('', false, objectModel);
      const constrainedObjectPropertyModel = new ConstrainedObjectPropertyModel('', '', objectPropertyModel.required, constrainedObjectModel);
      const constrainedValue = constrainFunction({constrainedObjectModel, objectModel, objectPropertyModel, constrainedObjectPropertyModel});
      expect(constrainedValue).toEqual('');
      for (const jestMockCallback of spies) {
        expect(jestMockCallback).toHaveBeenCalled();
      }
    });
  });
});
