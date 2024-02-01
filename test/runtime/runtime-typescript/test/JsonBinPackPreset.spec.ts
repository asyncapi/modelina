import { Address } from '../src/jsonbinpack/Address';

describe('Address', () => {
  const address = new Address({
    streetName: 'test',
    houseNumber: 1,
    marriage: true
  });
  test('be able to serialize model and turning it back to a model with the same values', async () => {
    const serialized = await address.jsonbinSerialize();
    const newAddress = await Address.jsonbinDeserialize(serialized);
    expect(address.marshal()).toEqual(newAddress.marshal());
  });
});
