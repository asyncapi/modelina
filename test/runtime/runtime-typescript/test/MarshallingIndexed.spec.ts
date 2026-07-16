import {TestObject} from '../src/marshalling-indexed/TestObject';
import {ObjectType} from '../src/marshalling-indexed/ObjectType';
import {ArrayItem} from '../src/marshalling-indexed/ArrayItem';

// With `mapType: 'indexedObject'` dictionaries are plain objects at runtime
// (declared as `{ [name: string]: T }`), not `Map`s. The serializer must
// iterate with `Object.entries()` and rebuild as plain objects instead of
// `Map`/`.entries()`/`new Map()` — otherwise marshal throws ("... is not a
// function") and unmarshal produces the wrong runtime type.
describe('Marshalling with mapType: indexedObject', () => {
  const testObject = new TestObject({
    stringType: 'test',
    numberType: 1,
    booleanType: true,
    requiredDate: new Date('2024-03-10T08:00:00Z'),
    requiredNullableDate: new Date('2023-06-15T12:00:00Z'),
    requiredRefArray: [new ArrayItem({itemName: 'item1'})],
    objectType: new ObjectType({test: 'test'}),
    // A normal (non-unwrap) dictionary property: a plain object, not a Map.
    dictionaryType: {a: 'one', b: 'two'},
    // Unwrapped additionalProperties: also a plain object.
    additionalProperties: {extra1: 'x', extra2: 'y'},
  });

  test('constructor accepts plain objects for dictionary + additionalProperties', () => {
    expect(testObject.dictionaryType).not.toBeInstanceOf(Map);
    expect(testObject.additionalProperties).not.toBeInstanceOf(Map);
  });

  test('marshal does not throw on plain-object dictionaries', () => {
    // The pre-fix code called `.entries()` on a plain object here.
    expect(() => testObject.marshal()).not.toThrow();
  });

  test('toJson emits the normal dictionary as a plain object under its key', () => {
    const json = testObject.toJson();
    expect(json['dictionary_type']).toEqual({a: 'one', b: 'two'});
  });

  test('toJson unwraps additionalProperties onto the top-level object', () => {
    const json = testObject.toJson();
    expect(json['extra1']).toBe('x');
    expect(json['extra2']).toBe('y');
    // Unwrapped keys must not leak an `additionalProperties` wrapper key.
    expect(json['additionalProperties']).toBeUndefined();
  });

  test('fromJson rebuilds the normal dictionary as a plain object, not a Map', () => {
    const instance = TestObject.fromJson(testObject.toJson());
    expect(instance.dictionaryType).not.toBeInstanceOf(Map);
    expect(instance.dictionaryType).toEqual({a: 'one', b: 'two'});
  });

  test('fromJson collects additionalProperties into a plain object, not a Map', () => {
    const instance = TestObject.fromJson(testObject.toJson());
    expect(instance.additionalProperties).not.toBeInstanceOf(Map);
    expect(instance.additionalProperties?.['extra1']).toBe('x');
    expect(instance.additionalProperties?.['extra2']).toBe('y');
  });

  test('round-trip: unmarshal(marshal()) preserves values', () => {
    const serialized = testObject.marshal();
    const roundTripped = TestObject.unmarshal(serialized);
    expect(roundTripped.marshal()).toEqual(serialized);
    expect(roundTripped.dictionaryType).toEqual({a: 'one', b: 'two'});
    expect(roundTripped.additionalProperties?.['extra1']).toBe('x');
  });
});
