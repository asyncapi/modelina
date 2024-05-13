import { Constraints, TypeMapping } from '../../src/helpers';

export const mockedTypeMapping: TypeMapping<any, any> = {
  Object: jest.fn().mockReturnValue('object'),
  Reference: jest.fn().mockReturnValue('reference'),
  Any: jest.fn().mockReturnValue('any'),
  Float: jest.fn().mockReturnValue('float'),
  Integer: jest.fn().mockReturnValue('integer'),
  String: jest.fn().mockReturnValue('string'),
  Boolean: jest.fn().mockReturnValue('boolean'),
  Tuple: jest.fn().mockReturnValue('tuple'),
  Array: jest.fn().mockReturnValue('array'),
  Enum: jest.fn().mockReturnValue('enum'),
  Union: jest.fn().mockReturnValue('union'),
  Dictionary: jest.fn().mockReturnValue('dictionary')
};

export const mockedConstraints: Constraints<any> = {
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
