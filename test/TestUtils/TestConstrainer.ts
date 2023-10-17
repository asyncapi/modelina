import { Constraints, TypeMapping } from '../../src/helpers';

export const mockedTypeMapping: TypeMapping<any, any> = {
  Object: jest.fn().mockReturnValue('test'),
  Reference: jest.fn().mockReturnValue('test'),
  Any: jest.fn().mockReturnValue('test'),
  Float: jest.fn().mockReturnValue('test'),
  Integer: jest.fn().mockReturnValue('test'),
  String: jest.fn().mockReturnValue('test'),
  Boolean: jest.fn().mockReturnValue('test'),
  Tuple: jest.fn().mockReturnValue('test'),
  Array: jest.fn().mockReturnValue('test'),
  Enum: jest.fn().mockReturnValue('test'),
  Union: jest.fn().mockReturnValue('test'),
  Dictionary: jest.fn().mockReturnValue('test')
};

export const mockedConstraints: Constraints = {
  enumKey: jest.fn().mockImplementation(({ enumKey }) => enumKey),
  enumValue: jest.fn().mockImplementation(({ enumValue }) => enumValue),
  modelName: jest.fn().mockImplementation(({ modelName }) => modelName),
  propertyKey: jest
    .fn()
    .mockImplementation(
      ({ objectPropertyModel }) => objectPropertyModel.propertyName
    ),
  constant: jest.fn().mockImplementation(({ constValue }) => constValue)
};
