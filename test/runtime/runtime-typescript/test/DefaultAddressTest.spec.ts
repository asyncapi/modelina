import Address from '../src/defaultExport/Address';
import NestedObject from '../src/defaultExport/NestedObject';

describe('Address', () => {
  test('should be able to instantiate default export model', () => {
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
    expect(address.streetName).toEqual('test');
    expect(address.houseNumber).toEqual(1);
    expect(address.marriage).toEqual(true);
    expect(address.members).toEqual(2);
    expect(address.arrayType).toEqual([1, 'test']);
    expect(address.nestedObject?.test).toEqual('test');
  });
});
