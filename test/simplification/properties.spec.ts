import * as fs from 'fs';
import * as path from 'path';
import simplifyProperties from '../../src/simplification/SimplifyProperties';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of properties', function() {
  test('should return as is', function() {
    const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/basic.json'), 'utf8');
    const schema = JSON.parse(schemaString);
    const {newModels, properties} = simplifyProperties(schema);
    expect(newModels).toBeUndefined();
    expect(properties).toEqual({ 
      "testProp1": { 
        "type": ["string"],
        "originalSchema": { 
          "type": "string"
        } 
      },
      "testProp2": { 
        "type": ["string"],
        "originalSchema": { 
          "type": "string"
        } 
      } 
    });
  });
  describe('from allOf schemas', function() {
    test('with simple schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/allOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const {newModels, properties} = simplifyProperties(schema);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({ 
        "testProp1": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp2": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        } 
      });
    });
    test('with nested schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/allOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const {newModels, properties} = simplifyProperties(schema);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({ 
        "testProp1": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp2": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp3": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        } 
      });
    });
  });
  describe('from anyOf schemas', function() {
    test('with simple schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/anyOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const {newModels, properties} = simplifyProperties(schema);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({ 
        "testProp1": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp2": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        } 
      });
    });
    test('with nested schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/anyOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const {newModels, properties} = simplifyProperties(schema);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({ 
        "testProp1": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp2": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp3": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        } 
      });
    });
  });
  describe('from oneOf schemas', function() {
    test('with simple schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/oneOf.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const {newModels, properties} = simplifyProperties(schema);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({ 
        "testProp1": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp2": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        } 
      });
    });
    test('with nested schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/oneOfNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const {newModels, properties} = simplifyProperties(schema);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({ 
        "testProp1": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp2": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp3": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        } 
      });
    });
  });
  describe('from if/then/else schemas', function() {
    test('with simple schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/conditional.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const {newModels, properties} = simplifyProperties(schema);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({ 
        "testProp1": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp2": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp3": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        } 
      });
    });
    test('with nested schema', function() {
      const schemaString = fs.readFileSync(path.resolve(__dirname, './properties/conditionalNested.json'), 'utf8');
      const schema = JSON.parse(schemaString);
      const {newModels, properties} = simplifyProperties(schema);
      expect(newModels).toBeUndefined();
      expect(properties).toEqual({ 
        "testProp1": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp2": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp3": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp4": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        },
        "testProp5": { 
          "type": ["string"],
          "originalSchema": { 
            "type": "string"
          } 
        } 
      });
    });
  });
});