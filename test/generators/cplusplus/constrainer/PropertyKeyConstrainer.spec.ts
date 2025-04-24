import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ObjectModel,
  ObjectPropertyModel,
  CplusplusGenerator
} from '../../../../src';
import {
  PropertyKeyConstraintOptions,
  defaultPropertyKeyConstraints
} from '../../../../src/generators/cplusplus/constrainer/PropertyKeyConstrainer';

describe('C++ PropertyKeyConstrainer', () => {
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
    return defaultPropertyKeyConstraints()({
      constrainedObjectModel,
      objectModel,
      objectPropertyModel,
      constrainedObjectPropertyModel,
      options: CplusplusGenerator.defaultOptions
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
    expect(constrainedKey).toEqual('empty');
  });
  test('should use constant naming format', () => {
    const constrainedKey = constrainPropertyName('some weird_value!"#2');
    expect(constrainedKey).toEqual(
      'some_space_weird_value_exclamation_quotation_hash_2'
    );
  });
  test('should not contain duplicate properties', () => {
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
    const constrainedKey = defaultPropertyKeyConstraints()({
      constrainedObjectModel,
      objectModel,
      objectPropertyModel,
      constrainedObjectPropertyModel,
      options: CplusplusGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('reserved_return');
  });
  test('should never render reserved keywords', () => {
    const constrainedKey = constrainPropertyName('return');
    expect(constrainedKey).toEqual('return');
  });
  test('should handle custom constraints', () => {
    const customConstraints: Partial<PropertyKeyConstraintOptions> = {
      NAMING_FORMATTER: (value: string) => value.toUpperCase(),
      NO_SPECIAL_CHAR: (value: string) => value.replace(/[^\w\s]/gi, ''),
      NO_EMPTY_VALUE: (value: string) => value || 'default'
    };

    const constrainedKey = defaultPropertyKeyConstraints(customConstraints)({
      constrainedObjectModel,
      objectModel,
      objectPropertyModel: new ObjectPropertyModel('', false, objectModel),
      constrainedObjectPropertyModel: new ConstrainedObjectPropertyModel(
        '',
        '',
        false,
        constrainedObjectModel
      ),
      options: CplusplusGenerator.defaultOptions
    });

    expect(constrainedKey).toEqual('_DEFAULT');
  });
});
