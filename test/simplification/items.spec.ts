import * as fs from 'fs';
import * as path from 'path';
import { Schema } from '../../src/models/Schema';
import Simplifier from '../../src/simplification/Simplifier';
import simplifyItems from '../../src/simplification/SimplifyItems';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of items', function () {
  describe('as is', function () {
    test('should return item', function () {
      const schema: any = { items: { type: "string" } };
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({
        originalSchema: schema.items,
        type: "string"
      });
    });
  });
  describe('from allOf schemas', function () {
    test('with simple schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/allOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "number"]
      });
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/allOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "boolean", "number"]
      });
    });
  });

  describe('from oneOf schemas', function () {
    test('with simple schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/oneOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "number"]
      });
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/oneOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "boolean", "number"]
      });
    });
  });

  describe('from anyOf schemas', function () {
    test('with simple schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/anyOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "number"]
      });
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/anyOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "boolean", "number"]
      });
    });
  });
  describe('from conditional if/then/else ', function () {
    test('with simple schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/conditional.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "boolean"]
      });
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/conditionalNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const output = simplifyItems(schema, simplifier);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "boolean", "number", "null"]
      });
    });
  });
  test('Should split out multiple objects into their own models and add reference', function () {
    const inputSchemaString = fs.readFileSync(path.resolve(__dirname, './items/multipleObjects.json'), 'utf8');
    const expectedCommonInputModelString = fs.readFileSync(path.resolve(__dirname, './items/expected/multipleObjects.json'), 'utf8');
    const inputSchema = JSON.parse(inputSchemaString);
    const expectedCommonInputModel = JSON.parse(expectedCommonInputModelString);
    const simplifier = new Simplifier();
    const output = simplifyItems(inputSchema, simplifier);
    expect(output.newModels).toEqual(expectedCommonInputModel);
    expect(output.items).toEqual({
      $ref: "anonymSchema1"
    });
  });
});