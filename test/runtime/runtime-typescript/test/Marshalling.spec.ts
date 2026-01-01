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
      });
      test('be able to serialize model', () => {
        const serialized = testObject.marshal();
      expect(serialized).toEqual(
  "{\"string_type\": \"test\",\"createdAt\": \"2023-01-01T10:00:00.000Z\",\"number_type\": 1,\"boolean_type\": true,\"union_type\": \"test\",\"array_type\": [1,\"test\"],\"tuple_type\": [\"test\",1],\"object_type\": {\"test\": \"test\"},\"dictionary_type\": {},\"enum_type\": \"{\\\"test\\\":2}\",\"test\": \"test\"}"
);});
      test('be able to serialize model and turning it back to a model with the same values', () => {
        const serialized = testObject.marshal();
        const newAddress = TestObject.unmarshal(serialized);
        expect(serialized).toEqual(newAddress.marshal());
      });
    })
  });
});
