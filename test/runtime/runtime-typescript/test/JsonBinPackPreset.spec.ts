import { ObjectType } from '../src/jsonbinpack/ObjectType';
import { TestObject } from '../src/jsonbinpack/TestObject';
import { EnumType } from '../src/jsonbinpack/EnumType';

describe('JSON binpack', () => {
  const objectType = new ObjectType({
    test: 'test'
  });
  const testObject = new TestObject({
    stringType: 'test',
    numberType: 1,
    booleanType: true,
    arrayType: ['test'],
    objectType: objectType,
    enumType: EnumType.CURLYLEFT_QUOTATION_TEST_QUOTATION_COLON_2_CURLYRIGHT,
    tupleType: ['test', 1]
  });
  test.skip('should be able to serialize model and turning it back to a model with the same values', async () => {
    const serialized = await testObject.jsonbinSerialize();
    const newTestObject = await TestObject.jsonbinDeserialize(serialized);
    expect(testObject.marshal()).toEqual(newTestObject.marshal());
  });
});
