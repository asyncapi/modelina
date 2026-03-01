import {TestObject} from '../src/marshalling/TestObject';
import {ObjectType} from '../src/marshalling/ObjectType';
import {EnumType} from '../src/marshalling/EnumType';

describe('Marshalling', () => {
  describe('should be able to serialize and deserialize the model', () => {
    describe('full model', () => {
      const objectType = new ObjectType({
        test: 'test'
      });
      const testObject = new TestObject({
        createdAt: new Date('2023-01-01T10:00:00Z'),
        stringType: 'test',
        numberType: 1,
        booleanType: true,
        arrayType: [1, 'test'],
        objectType: objectType,
        dictionaryType: new Map(Object.entries({"test": "test"})),
        additionalProperties: new Map(Object.entries({"test": "test"})),
        enumType: EnumType.CURLYLEFT_QUOTATION_TEST_QUOTATION_COLON_2_CURLYRIGHT,
        tupleType: ['test', 1],
        unionType: 'test',
        requiredNullableDate: new Date('2023-06-15T12:00:00Z'),
      });

      test('toJson should return a plain object', () => {
        const json = testObject.toJson();
        expect(typeof json).toBe('object');
        expect(json).not.toBeInstanceOf(String);
        expect(json["string_type"]).toBe('test');
        expect(json["number_type"]).toBe(1);
        expect(json["boolean_type"]).toBe(true);
      });

      test('toJson should handle nested objects by calling their toJson', () => {
        const json = testObject.toJson();
        // Nested objectType should be converted to plain object
        expect(json["object_type"]).toEqual({ test: 'test' });
      });

      test('fromJson should accept a plain object and return an instance', () => {
        const json = testObject.toJson();
        const instance = TestObject.fromJson(json);
        expect(instance).toBeInstanceOf(TestObject);
        expect(instance.stringType).toBe('test');
        expect(instance.numberType).toBe(1);
        expect(instance.booleanType).toBe(true);
      });

      test('fromJson should handle nested objects by calling their fromJson', () => {
        const json = testObject.toJson();
        const instance = TestObject.fromJson(json);
        expect(instance.objectType).toBeInstanceOf(ObjectType);
        expect(instance.objectType?.test).toBe('test');
      });

      test('round-trip: fromJson(toJson()) produces equivalent instance', () => {
        const json = testObject.toJson();
        const instance = TestObject.fromJson(json);
        // Compare serialized output to verify equivalence
        expect(instance.marshal()).toEqual(testObject.marshal());
      });

      test('marshal should use JSON.stringify(toJson())', () => {
        const marshalled = testObject.marshal();
        const toJsonResult = testObject.toJson();
        expect(marshalled).toEqual(JSON.stringify(toJsonResult));
      });

      test('unmarshal(object) should call fromJson directly', () => {
        const json = testObject.toJson();
        // unmarshal should accept object directly (backward compatibility)
        const instance = TestObject.unmarshal(json as any);
        expect(instance).toBeInstanceOf(TestObject);
        expect(instance.stringType).toBe('test');
      });

      test('be able to serialize model', () => {
        const serialized = testObject.marshal();
        // Note: marshal now uses JSON.stringify(toJson()) which produces standard JSON
        const parsed = JSON.parse(serialized);
        expect(parsed["string_type"]).toBe('test');
        expect(parsed["number_type"]).toBe(1);
        expect(parsed["boolean_type"]).toBe(true);
      });
      test('be able to serialize model and turning it back to a model with the same values', () => {
        const serialized = testObject.marshal();
        const newAddress = TestObject.unmarshal(serialized);
        expect(serialized).toEqual(newAddress.marshal());
      });

      test('unmarshal should convert date-formatted strings to Date objects', () => {
        const serialized = testObject.marshal();
        const unmarshalled = TestObject.unmarshal(serialized);

        // Verify the createdAt property is a Date object, not a string
        expect(unmarshalled.createdAt).toBeInstanceOf(Date);

        // Verify the Date value is correct
        expect(unmarshalled.createdAt?.toISOString()).toBe('2023-01-01T10:00:00.000Z');
      });

      test('unmarshal should handle null date values gracefully', () => {
        // Create a JSON string with null createdAt (optional date)
        const jsonWithNullDate = '{"string_type": "test", "createdAt": null, "boolean_type": true, "required_nullable_date": "2023-01-01T00:00:00Z"}';
        const unmarshalled = TestObject.unmarshal(jsonWithNullDate);

        // Optional properties should return undefined (not null) when JSON value is null
        // This is type-safe: createdAt is Date | undefined, not Date | null
        expect(unmarshalled.createdAt).toBeUndefined();
      });
    });

    describe('nullable types (type: [null, string])', () => {
      test('required nullable date should return null when JSON value is null', () => {
        // required_nullable_date is required but allows null (type: ['null', 'string'])
        // Type is Date | null (no undefined)
        const json = '{"string_type": "test", "boolean_type": true, "required_nullable_date": null}';
        const unmarshalled = TestObject.unmarshal(json);

        // Required nullable property should return null (not undefined)
        expect(unmarshalled.requiredNullableDate).toBeNull();
      });

      test('optional nullable date should return undefined when JSON value is null', () => {
        // nullable_date is optional and allows null (type: ['null', 'string'])
        // Type is Date | null | undefined
        const json = '{"string_type": "test", "boolean_type": true, "required_nullable_date": "2023-01-01T00:00:00Z", "nullable_date": null}';
        const unmarshalled = TestObject.unmarshal(json);

        // Optional nullable property should return undefined when JSON is null
        // (because optional properties use undefined, not null)
        expect(unmarshalled.nullableDate).toBeUndefined();
      });

      test('required nullable date should convert valid date string to Date object', () => {
        const json = '{"string_type": "test", "boolean_type": true, "required_nullable_date": "2023-06-15T12:00:00Z"}';
        const unmarshalled = TestObject.unmarshal(json);

        expect(unmarshalled.requiredNullableDate).toBeInstanceOf(Date);
        expect(unmarshalled.requiredNullableDate?.toISOString()).toBe('2023-06-15T12:00:00.000Z');
      });

      test('optional nullable date should convert valid date string to Date object', () => {
        const json = '{"string_type": "test", "boolean_type": true, "required_nullable_date": "2023-01-01T00:00:00Z", "nullable_date": "2023-07-20T15:30:00Z"}';
        const unmarshalled = TestObject.unmarshal(json);

        expect(unmarshalled.nullableDate).toBeInstanceOf(Date);
        expect(unmarshalled.nullableDate?.toISOString()).toBe('2023-07-20T15:30:00.000Z');
      });

      test('nullable string should preserve null value', () => {
        const json = '{"string_type": "test", "boolean_type": true, "required_nullable_date": "2023-01-01T00:00:00Z", "nullable_string": null}';
        const unmarshalled = TestObject.unmarshal(json);

        // nullable_string preserves null because strings don't have
        // special Date conversion logic - the value passes through directly
        expect(unmarshalled.nullableString).toBeNull();
      });
    });
  });
});
