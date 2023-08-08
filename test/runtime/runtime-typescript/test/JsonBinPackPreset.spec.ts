import { Address } from '../src/jsonbinpack/Address';
import { NestedObject } from '../src/jsonbinpack/NestedObject';

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
  test('be able to serialize model and turning it back to a model with the same values', async () => {
    const serialized = await address.jsonbinSerialize();
    const newAddress = await Address.jsonbinDeserialize(serialized);
    expect(address.marshal()).toEqual(newAddress.marshal());
  });
});
