import * as fs from 'fs';
import * as path from 'path';
import { Schema } from '../../src/models/Schema';
import simplifyItems from '../../src/simplification/SimplifyItems';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of items', function () {
  describe('as is', function () {
    test('should return item', function () {
      const schema: any = { items: { type: "string" } };
      const output = simplifyItems(schema);
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
      const output = simplifyItems(schema);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "number"]
      });
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/allOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const output = simplifyItems(schema);
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
      const output = simplifyItems(schema);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "number"]
      });
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/oneOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const output = simplifyItems(schema);
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
      const output = simplifyItems(schema);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "number"]
      });
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/anyOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const output = simplifyItems(schema);
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
      const output = simplifyItems(schema);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "boolean"]
      });
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './items/conditionalNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const output = simplifyItems(schema);
      expect(output.items).toEqual({
        originalSchema: schema,
        type: ["string", "boolean", "number", "null"]
      });
    });
  });
  test('Should split out multiple objects into their own models and add reference', function () {
    const schemaString = fs.readFileSync(path.resolve(__dirname, './items/multipleObjects.json'), 'utf8');
    const schema = JSON.parse(schemaString);
    const output = simplifyItems(schema);
    expect(output.newModels).toHaveLength(2);
    expect(output.newModels![0]).toEqual({
      originalSchema: {
        type: "object",
        properties: {
          floor: {
            type: "number",
          },
        },
      },
      type: "object",
      $id: "anonymSchema2",
      properties: {
        floor: {
          originalSchema: {
            type: "number",
          },
          type: "number",
        },
      },
    });
    expect(output.newModels![1]).toEqual({
      originalSchema: {
        type: "object",
        properties: {
          street_address: {
            type: "object",
            properties: {
              floor: {
                type: "number",
              },
            },
          },
          country: {
            enum: [
              "United States of America",
              "Canada",
            ],
          },
        },
      },
      type: "object",
      $id: "anonymSchema1",
      properties: {
        street_address: {
          $ref: "anonymSchema2",
        },
        country: {
          originalSchema: {
            enum: [
              "United States of America",
              "Canada",
            ],
          },
          type: "string",
          enum: [
            "United States of America",
            "Canada",
          ],
        },
      },
    });
    expect(output.items).toEqual({
      $ref: "anonymSchema1"
    });
  });
});