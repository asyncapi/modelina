import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models';
import { Simplifier } from '../../src/simplification/Simplifier';
import simplifyAdditionalProperties from '../../src/simplification/SimplifyAdditionalProperties';
const simplifyMock = Simplifier.prototype.simplify = jest.fn().mockImplementation(Simplifier.prototype.simplify);
const simplifyRecursiveMock = Simplifier.prototype.simplifyRecursive = jest.fn().mockImplementation(Simplifier.prototype.simplifyRecursive);

describe('Simplification to additionalProperties', function() {
  test('should always return undefined if type is not object', function() {
    const schema = {type: "string"};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = "string";
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toBeUndefined();
    expect(simplifyMock).toHaveBeenCalledTimes(0);
    expect(simplifyRecursiveMock).toHaveBeenCalledTimes(0);
  });
  test('should always return undefined if all types has been defined', function() {
    const schema = {type: ["string", "object", "null", "number", "array", "boolean"]};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = ["string", "object", "null", "number", "array", "boolean"];
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toBeUndefined();
    expect(simplifyMock).toHaveBeenCalledTimes(0);
    expect(simplifyRecursiveMock).toHaveBeenCalledTimes(0);
  });
  test('should always return true if type object and nothing is defined', function() {
    const schema = {type: "object"};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = "object";
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toEqual(true);
    expect(simplifyMock).toHaveBeenCalledTimes(0);
    expect(simplifyRecursiveMock).toHaveBeenCalledTimes(0);
  });
  test('should return true if additionalProperties is true', function() {
    const schema = { type: "object", additionalProperties: true};
    const simplifier = new Simplifier();
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, new CommonModel());
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toEqual(true);
    expect(simplifyMock).toHaveBeenCalledTimes(0);
    expect(simplifyRecursiveMock).toHaveBeenCalledTimes(0);
  });
  test('should return false if additionalProperties is false', function() {
    const schema = { type: "object", additionalProperties: false};
    const simplifier = new Simplifier();
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, new CommonModel());
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toEqual(false);
    expect(simplifyMock).toHaveBeenCalledTimes(0);
    expect(simplifyRecursiveMock).toHaveBeenCalledTimes(0);
  });
  test('should return simplified additionalProperties if schema', function() {
    const schema = { type: "object", additionalProperties: {type: "object", properties: {"test": {type: "string"}}}};
    const expectedSchemaString = fs.readFileSync(path.resolve(__dirname, './additionalProperties/expected/simple.json'), 'utf8');
    const expectedModels = JSON.parse(expectedSchemaString);
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = "object";
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties).toEqual(expectedModels);
    expect(simplifyMock).toHaveBeenCalledTimes(2);
    expect(simplifyRecursiveMock).toHaveBeenCalledTimes(2);
  });
});