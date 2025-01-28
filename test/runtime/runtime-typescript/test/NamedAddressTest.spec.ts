import {TestObject} from '../src/namedExport/TestObject';
import {ObjectType} from '../src/namedExport/ObjectType';
import {EnumType} from '../src/namedExport/EnumType';

describe('Named exports', () => {
  test('should be able to instantiate named export model', () => {
    const objectType = new ObjectType({
      test: 'test'
    });
    const testObject = new TestObject({
      stringType: 'test',
      numberType: 1,
      booleanType: true,
      arrayType: [1, 'test'],
      objectType: objectType,
      dictionaryType: new Map(Object.entries({"test": "test"})),
      additionalProperties: new Map(Object.entries({"test": "test"})),
      enumType: EnumType.CURLYLEFT_QUOTATION_TEST_QUOTATION_COLON_2_CURLYRIGHT,
      tupleType: ['test', 1],
      unionType: 'test'
    });
    expect(testObject.stringType).toEqual('test');
    expect(testObject.numberType).toEqual(1);
    expect(testObject.booleanType).toEqual(true);
    expect(testObject.arrayType).toEqual([1, 'test']);
    expect(testObject.objectType).toEqual(objectType);
    expect(Object.fromEntries(testObject.dictionaryType!)).toEqual({"test": "test"});
    expect(Object.fromEntries(testObject.additionalProperties!)).toEqual({"test": "test"});
    expect(testObject.enumType).toEqual(EnumType.CURLYLEFT_QUOTATION_TEST_QUOTATION_COLON_2_CURLYRIGHT);
    expect(testObject.tupleType).toEqual(['test', 1]);
    expect(testObject.unionType).toEqual('test');
  });
});
