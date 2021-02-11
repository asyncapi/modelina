import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models';
import { Simplifier } from '../../src/simplification/Simplifier';
import simplifyAdditionalProperties from '../../src/simplification/SimplifyAdditionalProperties';

describe('Simplification to additionalProperties', function() {
  test('should always return undefined if type is not object', function() {
    const schema = {type: "string"};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = "string";
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toBeUndefined();
  });
  test('should always return undefined if all types has been defined', function() {
    const schema = {type: ["string", "object", "null", "number", "array", "boolean"]};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = ["string", "object", "null", "number", "array", "boolean"];
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toBeUndefined();
  });
  test('should always return true if type object and nothing is defined', function() {
    const schema = {type: "object"};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = "object";
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toEqual({
      originalSchema: true,
      type: [
        "object",
        "string",
        "number",
        "array",
        "boolean",
        "null",
      ],
    });
  });
  test('should return true if additionalProperties is true', function() {
    const schema = { type: "object", additionalProperties: true};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = "object";
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toEqual({
      originalSchema: true,
      type: [
        "object",
        "string",
        "number",
        "array",
        "boolean",
        "null",
      ],
    });
  });
  test('should return false if additionalProperties is false', function() {
    const schema = { type: "object", additionalProperties: false};
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = "object";
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties.newModels).toBeUndefined();
    expect(simplifiedAdditionalProperties.additionalProperties).toBeUndefined();
  });
  test('should return simplified additionalProperties if schema', function() {
    const schema = { type: "object", additionalProperties: {type: "object", properties: {"test": {type: "string"}}}};
    const expectedSchemaString = fs.readFileSync(path.resolve(__dirname, './additionalProperties/expected/simple.json'), 'utf8');
    const expectedAdditionalProperties = JSON.parse(expectedSchemaString);
    const simplifier = new Simplifier();
    const commonModel = new CommonModel();
    commonModel.type = "object";
    const simplifiedAdditionalProperties = simplifyAdditionalProperties(schema, simplifier, commonModel);
    expect(simplifiedAdditionalProperties).toEqual(expectedAdditionalProperties);
  });
});