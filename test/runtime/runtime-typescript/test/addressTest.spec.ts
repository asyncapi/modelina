import { Address } from '../src/Address';
import { NestedObject } from '../src/NestedObject';

describe('Address', () => {
  const nestedObj = new NestedObject({
    test: 'test'
  });
  const address = new Address({
    streetName: 'test',
    houseNumber: 1,
    marriage: true,
    members: 2,
    arrayType: [1, 'test'],
    nestedObject: nestedObj
  });
  test('be able to serialize model', () => {
    const serialized = address.marshal();
    expect(serialized).toEqual(
      '{"street_name": "test","house_number": 1,"marriage": true,"members": 2,"array_type": [1,"test"],"nestedObject": {"test": "test"}}'
    );
  });
  test('be able to serialize model and turning it back to a model with the same values', () => {
    const serialized = address.marshal();
    const newAddress = Address.unmarshal(serialized);
    expect(serialized).toEqual(newAddress.marshal());
  });
});
