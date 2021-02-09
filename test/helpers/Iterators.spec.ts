import { traverseSchema, SchemaTypesToIterate, TraverseSchemaCallback } from "../../src/helpers/Iterators";
import { ParsedSchema } from "../../src/models/ParsedSchema";
describe('traverseSchema', function () {
  test('Should traverse everything by default', function () {

    const iteratedSchemas = new Map();
    const cb : TraverseSchemaCallback = (schema : ParsedSchema) => {
      iteratedSchemas.set(schema.$id, schema);
      return true;
    };
    traverseSchema({}, cb);

    //Ensure the actual keys are as expected
    const schemaKeys = Array.from(iteratedSchemas.keys());
    expect(schemaKeys).toEqual([
      
    ]);
  });
});