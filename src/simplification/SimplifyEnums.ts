import { Schema } from 'models/Schema';

type Output = any[] | undefined;
/**
 * Find the enums for a simplified version of a schema
 * 
 * @param schema to find the simplified enums for
 * @param seenSchemas already seen schemas and their corresponding output, this is to avoid circular schemas
 */
export default function simplifyEnums(schema: Schema | boolean, seenSchemas: Map<any, Output> = new Map()): Output {
  if (typeof schema !== 'boolean') {
    if (seenSchemas.has(schema)) {return seenSchemas.get(schema);}
    let enums: any[] = [];
    seenSchemas.set(schema, enums);

    if (schema.enum) {
      addToEnums(schema.enum, enums);
    }

    //If we encounter combination schemas ensure we recursively find the enums
    handleCombinationSchemas(schema.allOf, enums, seenSchemas);
    handleCombinationSchemas(schema.oneOf, enums, seenSchemas);
    handleCombinationSchemas(schema.anyOf, enums, seenSchemas);

    //If we encounter combination schemas ensure we recursively find the enums
    if (schema.then) {
      addToEnums(simplifyEnums(schema.then, seenSchemas), enums);
    }
    if (schema.else) {
      addToEnums(simplifyEnums(schema.else, seenSchemas), enums);
    }

    //If const is defined overwrite any already determined enums
    if (schema.const !== undefined) {
      enums = [schema.const];
    }

    ensureNotEnumsAreRemoved(schema, enums, seenSchemas);
    return enums;
  }
  return undefined;
}

/**
 * Ensure enums in not are never included.
 * 
 * @param schema currently searching in
 * @param existingEnums which have already been found
 * @param seenSchemas already seen schemas and their respectable output
 */
function ensureNotEnumsAreRemoved(schema: Schema, existingEnums: any[], seenSchemas: Map<any, Output>) {
  if (schema.not) {
    const notEnums = simplifyEnums(schema.not, seenSchemas);
    if (notEnums !== undefined) {
      notEnums.forEach((notEnum) => {
        //If it exist remove it
        if (existingEnums.includes(notEnum)) {
          existingEnums.splice(existingEnums.indexOf(notEnum), 1);
        }
      });
    }
  }
}

/**
 * Ensuring all enums inside combination schemas are added
 * 
 * @param schemas to search in
 * @param existingEnums which have already been found
 * @param seenSchemas already seen schemas and their respectable output
 */
function handleCombinationSchemas(schemas: (Schema | boolean)[] = [], existingEnums: any[], seenSchemas: Map<any, Output>) {
  schemas.forEach((schema) => {
    addToEnums(simplifyEnums(schema, seenSchemas), existingEnums);
  });
}

/**
 * Tries to add enums if they don't already exist
 * 
 * @param enumsToCheck
 * @param existingEnums 
 */
function addToEnums(enumsToCheck: any[] | undefined, existingEnums: any[]) {
  if (enumsToCheck === undefined) {return;}
  enumsToCheck.forEach((value) => {
    if (!existingEnums.includes(value)) {
      existingEnums.push(value);
    }
  });
}

