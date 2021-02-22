import { Schema } from 'models/Schema';

type Output = string[] | string | undefined;
/**
 * Find the types for a simplified version of a schema
 * 
 * @param schema to find the simplified types for
 * @param seenSchemas already seen schemas and their corresponding output, this is to avoid circular schemas
 */
export default function simplifyTypes(schema: Schema | boolean, seenSchemas: Map<any, Output> = new Map()): Output {
  //If we find absence of data format ensure all types are returned
  if (typeof schema === 'boolean') {
    if (schema === true) {
      return ['object', 'string', 'number', 'array', 'boolean', 'null'];
    } 
    throw new Error('False value schemas are not supported');
  }
  const types: Output = [];
  if (seenSchemas.has(schema)) return seenSchemas.get(schema);
  seenSchemas.set(schema, types);

  addToTypes(schema.type, types);

  //If we encounter combination schemas ensure we recursively find the types
  combineSchemas(schema.allOf, types, seenSchemas);
  combineSchemas(schema.oneOf, types, seenSchemas);
  combineSchemas(schema.anyOf, types, seenSchemas);

  //Infer types from items and properties
  if (schema.items !== undefined) {
    addToTypes('array', types);
  }
  if (schema.properties !== undefined) {
    addToTypes('object', types);
  }

  //If we encounter combination schemas ensure we recursively find and cumulate the types
  combineSchemas(schema.then, types, seenSchemas);
  combineSchemas(schema.else, types, seenSchemas);

  //Check enums and const keywords to infer type if type has not already been defined.
  if (!schema.type) {
    inferTypes(schema, types); 
  }

  //Infer which types should not be there and include what is left.
  inferNotTypes(schema, types, seenSchemas);

  //Ensure we return the correct format of output
  if (types.length === 0) {
    return undefined;
  } else if (types.length === 1) {
    return types[0];
  }
  return types;
}

/**
 * Infers the JSON Schema type from value
 * 
 * @param value to infer type of
 */
function inferTypeFromValue(value: any) {
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value === null) {
    return 'null';
  }
  const typeOfEnum = typeof value;
  if (typeOfEnum === 'bigint') {
    return 'number';
  } 
  return typeOfEnum;
}

/**
 * Infer types from enum and const values.
 * 
 * @param schema to go through
 * @param currentOutput the current output
 */
function inferTypes(schema: Schema | boolean, currentOutput: Output) {
  if (schema === undefined || typeof schema === 'boolean' || currentOutput === undefined) return; 
  if (!Array.isArray(currentOutput)) return;
  if (schema.enum) {
    schema.enum.forEach((value: any) => {
      const inferredType = inferTypeFromValue(value);
      if (inferredType !== undefined) {
        addToTypes(inferredType, currentOutput);
      }
    });
  }
  //Should const overwrite the type?
  if (schema.const !== undefined) {
    const inferredType = inferTypeFromValue(schema.const);
    if (inferredType !== undefined) {
      currentOutput.length = 0;
      currentOutput.splice(0, currentOutput.length);
      currentOutput[0] = inferredType;
    }
  }
}

/**
 * Infer which types the model should NOT be. 
 * 
 * @param schema to go through
 * @param currentOutput the current output
 * @param seenSchemas schemas which we already have outputs for
 */
function inferNotTypes(schema: Schema | boolean, currentOutput: Output, seenSchemas: Map<any, Output>) {
  if (schema === undefined || currentOutput === undefined) return;
  if (!Array.isArray(currentOutput)) return;
  if (typeof schema === 'boolean') return;
  if (schema.not) {
    const notTypes = simplifyTypes(schema.not, seenSchemas);
    // Cut any not types from the existing output.
    const tryAndCutRemainingArray = (notType: string | string[] | undefined) => {
      if (notType === undefined) return;
      if (Array.isArray(notType)) {
        notType.forEach((notType) => {
          tryAndCutRemainingArray(notType);
        });
      } else if (currentOutput.includes(notType)) {
        currentOutput.splice(currentOutput.indexOf(notType), 1);
      }
    };
    tryAndCutRemainingArray(notTypes);
  }
}

/**
 * Adds missing types to the array.
 * 
 * @param typesToAdd which types we should try and add to the existing output
 * @param currentOutput the current output
 */
function addToTypes(typesToAdd: Output, currentOutput: Output) {
  if (typesToAdd !== undefined) {
    if (Array.isArray(typesToAdd)) {
      typesToAdd.forEach((value) => {
        addToTypes(value, currentOutput);
      });
    } else if (Array.isArray(currentOutput) && !currentOutput.includes(typesToAdd)) {
      currentOutput.push(typesToAdd);
    }
  }
}

/**
 * Go through schema(s) and combine the simplified types together.
 * 
 * @param schema to go through
 * @param currentOutput the current output
 * @param seenSchemas schemas which we already have outputs for
 */
function combineSchemas(schema: (Schema | boolean) | (Schema | boolean)[] | undefined, currentOutput: Output, seenSchemas: Map<any, Output>) {
  if (schema === undefined) return;
  if (typeof schema === 'boolean') return;
  if (Array.isArray(schema)) {
    schema.forEach((itemSchema) => {
      combineSchemas(itemSchema, currentOutput, seenSchemas);
    });
  } else {
    addToTypes(simplifyTypes(schema, seenSchemas), currentOutput);
  }
}