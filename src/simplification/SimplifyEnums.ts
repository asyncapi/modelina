import { Schema } from "models/Schema";

type Output = any[] | undefined;
/**
 * Find the enums for a simplified version of a schema
 * 
 * @param input to find the simplified enums for
 */
export default function simplifyEnums(input: Schema | boolean): Output {
  const seenSchemas: Map<any, Output> = new Map();
  const callback = (schema: Schema | boolean): Output => {
    if (typeof schema !== "boolean") {
      let enums: any[] = [];
      if (seenSchemas.has(schema)) return seenSchemas.get(schema);
      seenSchemas.set(schema, enums);
      const addToEnums = (enumsToCheck: any[] | undefined) => {
        if (enumsToCheck === undefined) return;
        enumsToCheck.forEach((value) => {
          if (!enums.includes(value)) {
            enums.push(value);
          }
        });
      };
      const handleCombinationSchemas = (schemas: (Schema | boolean)[] = []) => {
        schemas.forEach((schema) => {
          addToEnums(callback(schema));
        });
      }

      if (schema.enum) {
        addToEnums(schema.enum);
      }
      //If we encounter combination schemas ensure we recursively find the enums
      handleCombinationSchemas(schema.allOf);
      handleCombinationSchemas(schema.oneOf);
      handleCombinationSchemas(schema.anyOf);

      //If we encounter combination schemas ensure we recursively find the enums
      if (schema.then) {
        addToEnums(callback(schema.then));
      }
      if (schema.else) {
        addToEnums(callback(schema.else));
      }

      //If const is defined overwrite any already determined enums
      if (schema.const !== undefined) {
        enums = [schema.const]
      }

      //Ensure any enums which should not be present
      if (schema.not) {
        let notEnums = callback(schema.not);
        if (notEnums !== undefined) {
          notEnums.forEach((notEnum) => {
            if (enums.includes(notEnum)) {
              enums.splice(enums.indexOf(notEnum), 1);
            }
          });
        }
      }
      return enums;
    }
    return undefined;
  };
  return callback(input);
}