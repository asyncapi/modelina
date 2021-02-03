import * as fs from 'fs';
import * as path from 'path';
import Simplifier from '../../src/simplification/Simplifier';
import simplifyProperties from '../../src/simplification/SimplifyProperties';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of properties', function () {
  test('should return as is', function () {
    const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/basic.json'), 'utf8');
    const schema = JSON.parse(schemaString);
    const simplifier = new Simplifier();
    const { newModels, properties } = simplifyProperties(schema, simplifier);
    expect(newModels).toBeUndefined();
    expect(properties).toEqual({
      "testProp1": {
        "type": "string",
        "originalSchema": {
          "type": "string"
        }
      },
      "testProp2": {
        "type": "string",
        "originalSchema": {
          "type": "string"
        }
      }
    });
  });
  describe('from allOf schemas', function () {
    test('with simple schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/allOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const { newModels, properties } = simplifyProperties(schema, simplifier);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({
        "testProp1": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp2": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        }
      });
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/allOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const { newModels, properties } = simplifyProperties(schema, simplifier);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({
        "testProp1": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp2": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp3": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        }
      });
    });
  });
  describe('from anyOf schemas', function () {
    test('with simple schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/anyOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const { newModels, properties } = simplifyProperties(schema, simplifier);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({
        "testProp1": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp2": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        }
      });
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/anyOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const { newModels, properties } = simplifyProperties(schema, simplifier);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({
        "testProp1": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp2": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp3": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        }
      });
    });
  });
  describe('from oneOf schemas', function () {
    test('with simple schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/oneOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const { newModels, properties } = simplifyProperties(schema, simplifier);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({
        "testProp1": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp2": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        }
      });
    });
    test('with nested oneOf schemas', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/oneOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const { newModels, properties } = simplifyProperties(schema, simplifier);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({
        "testProp1": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp2": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp3": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        }
      });
    });
  });
  describe('from if/then/else schemas', function () {
    test('with simple schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/conditional.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const { newModels, properties } = simplifyProperties(schema, simplifier);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({
        "testProp1": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp2": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp3": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        }
      });
    });
    test('with nested schema', function () {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/conditionalNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const simplifier = new Simplifier();
      const { newModels, properties } = simplifyProperties(schema, simplifier);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({
        "testProp1": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp2": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp3": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp4": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        },
        "testProp5": {
          "type": "string",
          "originalSchema": {
            "type": "string"
          }
        }
      });
    });
  });
  test('Should merge properties which same key', function () {
    const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/combine_properties.json'), 'utf8');
    const schema = JSON.parse(schemaString);
    const simplifier = new Simplifier();
    const { newModels, properties } = simplifyProperties(schema, simplifier);
    expect(newModels).toBeUndefined();
    expect(properties).toEqual(expect.objectContaining({
      "testProp1": {
        originalSchema: {
          allOf: [
            {
              properties: {
                testProp1: {
                  type: "string",
                  enum: [
                    "merge",
                  ],
                },
              },
            },
            {
              properties: {
                testProp1: {
                  type: "number",
                  enum: [
                    0,
                  ],
                },
              },
            },
          ],
        },
        type: [
          "string",
          "number",
        ],
        enum: [
          "merge",
          0,
        ],
      }
    }));
  });
  test('Should split out multiple objects into their own models and add reference', function () {
    const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/multiple_objects.json'), 'utf8');
    const schema = JSON.parse(schemaString);
    const simplifier = new Simplifier();
    const { newModels, properties } = simplifyProperties(schema, simplifier);
    expect(newModels).toHaveLength(1);
    expect(newModels).toEqual(expect.arrayContaining([expect.objectContaining({
      originalSchema: {
        type: "object",
        properties: {
          floor: {
            type: "number",
          },
        },
      },
      type: "object",
      $id: "anonymSchema1",
      properties: {
        floor: {
          originalSchema: {
            type: "number",
          },
          type: "number",
        },
      },
    })]));
    expect(properties).toMatchObject({
      street_address: {
        $ref: "anonymSchema1",
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
    });
  });
});
