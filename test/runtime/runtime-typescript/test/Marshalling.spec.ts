import { Address } from '../src/marshalling/Address';
import { NestedObject } from '../src/marshalling/NestedObject';

describe('Address', () => {
  describe('marshalling', () => {
    describe('required properties', () => {
      const address = new Address({
        streetName: 'test',
        houseNumber: 1,
        arrayType: [1, 'test']
      });
      test('should contain correctly marshalled JSON', () => {
        const serialized = address.marshal();
        expect(serialized).toEqual("{\"street_name\": \"test\",\"house_number\": 1,\"array_type\": [1,\"test\"]}");
      });
      test('be able to serialize model and turning it back to a model with the same values', () => {
        const serialized = address.marshal();
        const newAddress = Address.unmarshal(serialized);
        expect(serialized).toEqual(newAddress.marshal());
      });
    });

    describe('marriage', () => {
      const address = new Address({
        streetName: 'test',
        houseNumber: 1,
        arrayType: [1, 'test'],
        marriage: true,
      });
      test('should contain correctly marshalled JSON', () => {
        const serialized = address.marshal();
        expect(serialized).toEqual("{\"street_name\": \"test\",\"house_number\": 1,\"marriage\": true,\"array_type\": [1,\"test\"]}");
      });
      test('be able to serialize model and turning it back to a model with the same values', () => {
        const serialized = address.marshal();
        const newAddress = Address.unmarshal(serialized);
        expect(serialized).toEqual(newAddress.marshal());
      });
    });

    describe('members', () => {
      const address = new Address({
        streetName: 'test',
        houseNumber: 1,
        arrayType: [1, 'test'],
        members: 2,
      });
      test('should contain correctly marshalled JSON', () => {
        const serialized = address.marshal();
        expect(serialized).toEqual("{\"street_name\": \"test\",\"house_number\": 1,\"members\": 2,\"array_type\": [1,\"test\"]}");
      });
      test('be able to serialize model and turning it back to a model with the same values', () => {
        const serialized = address.marshal();
        const newAddress = Address.unmarshal(serialized);
        expect(serialized).toEqual(newAddress.marshal());
      });
    });

    describe('nestedObject', () => {
      const nestedObj = new NestedObject({
        test: 'test'
      });
      const address = new Address({
        streetName: 'test',
        houseNumber: 1,
        arrayType: [1, 'test'],
        nestedObject: nestedObj
      });
      test('should contain correctly marshalled JSON', () => {
        const serialized = address.marshal();
        expect(serialized).toEqual("{\"street_name\": \"test\",\"house_number\": 1,\"array_type\": [1,\"test\"],\"nestedObject\": {\"test\": \"test\"}}");
      });
      test('be able to serialize model and turning it back to a model with the same values', () => {
        const serialized = address.marshal();
        const newAddress = Address.unmarshal(serialized);
        expect(serialized).toEqual(newAddress.marshal());
      });
    });
    describe('full model', () => {
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
        expect(serialized).toEqual("{\"street_name\": \"test\",\"house_number\": 1,\"marriage\": true,\"members\": 2,\"array_type\": [1,\"test\"],\"nestedObject\": {\"test\": \"test\"}}");
      });
      test('be able to serialize model and turning it back to a model with the same values', () => {
        const serialized = address.marshal();
        const newAddress = Address.unmarshal(serialized);
        expect(serialized).toEqual(newAddress.marshal());
      });
    })
  });
});
