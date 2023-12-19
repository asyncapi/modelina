import { RustDefaultConstraints } from '../../../../src/generators/rust/RustConstrainer';
import {
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ObjectModel,
  ObjectPropertyModel,
  RustGenerator
} from '../../../../src';
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
    return RustDefaultConstraints.propertyKey({
      constrainedObjectModel,
      objectModel,
      objectPropertyModel,
      constrainedObjectPropertyModel,
      options: RustGenerator.defaultOptions
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
      'some_weird_value_exclamation_quotation_hash_2'
    );
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
      'reserved_return',
      false,
      objectModel
    );
    const constrainedObjectPropertyModel = new ConstrainedObjectPropertyModel(
      'reserved_return',
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
    constrainedObjectModel.properties['reserved_return'] =
      constrainedObjectPropertyModel;
    constrainedObjectModel.properties['return'] =
      constrainedObjectPropertyModel2;
    const constrainedKey = RustDefaultConstraints.propertyKey({
      constrainedObjectModel,
      objectModel,
      objectPropertyModel: objectPropertyModel2,
      constrainedObjectPropertyModel: constrainedObjectPropertyModel2,
      options: RustGenerator.defaultOptions
    });
    expect(constrainedKey).toEqual('reserved_reserved_return');
  });
  test('should never render reserved keywords', () => {
    const constrainedKey = constrainPropertyName('return');
    expect(constrainedKey).toEqual('reserved_return');
  });
});
