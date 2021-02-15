import simplifyRequired from '../../src/simplification/SimplifyRequired';

/**
 * Some of these test are purely theoretical and have little if any merit 
 * on a JSON Schema which actually makes sense but are used to test the principles.
 */
describe('Simplification of required', function() {
  test('should support simple required', function() {
    const schema = {
      "type": "object",
      "properties": { 
        "testProp1": { 
          "type": "string"
        } 
      },
      "required": ["testProp1"],
    }
    const expected = ["testProp1"];

    const required = simplifyRequired(schema);
    expect(required).toEqual(expected);
  });

  test('should support advanced required with conditions', function() {
    const schema = {
      "type": "object",
      "properties": { 
        "testProp1": { 
          "type": "string"
        } 
      },
      "required": ["testProp1"],
      "if": {
          "properties": { 
            "testProp1": { 
              "const": "string"
            } 
          } 
      },
      "then": {
          "properties": { 
            "testProp2": { 
              "type": "string"
            } 
          } 
      },
      "else": {
          "properties": { 
            "testProp3": { 
              "type": "string"
            } 
          },
          "required": ["testProp3"],
      }
    }
    const expected = ["testProp1", "testProp3"];

    const required = simplifyRequired(schema);
    expect(required).toEqual(expected);
  });
  
  test('should support advanced required with nested objects', function() {
    const schema = {
      "type": "object",
      "anyOf": [
        {
            "oneOf": [
                { 
                  "properties": { 
                    "testProp1": { 
                      "type": "string"
                    } 
                  }  
                },
                { 
                  "properties": { 
                    "testProp2": { 
                      "type": "string"
                    } 
                  },
                  "required": ["testProp2"],  
                }
            ]
        },
        { 
          "properties": { 
            "testProp3": { 
              "type": "string"
            } 
          },
          "required": ["testProp3"],
        }
      ]
    }
    const expected = ["testProp2", "testProp3"];

    const required = simplifyRequired(schema as any);
    expect(required).toEqual(expected);
  });
});
