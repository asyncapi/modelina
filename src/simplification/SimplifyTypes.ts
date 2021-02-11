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
  let types: Output = undefined;
  if (seenSchemas.has(schema)) return seenSchemas.get(schema);
  seenSchemas.set(schema, types);
  const addToTypes = (typesToCheck: Output) => {
    if (typesToCheck !== undefined) {
      if (types === undefined) {
        types = typesToCheck;
      } else if (Array.isArray(typesToCheck)) {
        typesToCheck.forEach(addToTypes);
      } else if (Array.isArray(types)) {
        if (!types.includes(typesToCheck)) {
          types.push(typesToCheck);
        }
      } else if (types !== typesToCheck) {
        types = [types, typesToCheck];
      }
    }
  };
  const handler = (schemas: (Schema | boolean)[] = []) => {
    schemas.forEach((schema) => {
      addToTypes(simplifyTypes(schema, seenSchemas));
    });
  };

  if (schema.type) {
    addToTypes(schema.type);
  }
  //If we encounter combination schemas ensure we recursively find the types
  handler(schema.allOf);
  handler(schema.oneOf);
  handler(schema.anyOf);

  //Infer types from items and properties
  if (schema.items !== undefined) {
    addToTypes('array');
  }
  if (schema.properties !== undefined) {
    addToTypes('object');
  }

  //If we encounter combination schemas ensure we recursively find and cumulate the types
  if (schema.then) {
    addToTypes(simplifyTypes(schema.then, seenSchemas));
  }
  if (schema.else) {
    addToTypes(simplifyTypes(schema.else, seenSchemas));
  }

  //Check enums and const keywords to infer type if type has not already been defined.
  if (!schema.type) {
    const inferTypeFromValue = (value: any) => {
      if (Array.isArray(value)) {
        return 'array';
      }
      if (value === null) {
        return 'null';
      }
      const typeOfEnum = typeof value;
      switch (typeOfEnum) {
      //We don't need to check undefined, function, symbol since it should never be possible
      case 'bigint':
        return 'number';
      default:
        return typeOfEnum;
      }
    };
    if (schema.enum) {
      schema.enum.forEach((value: any) => {
        const inferredType = inferTypeFromValue(value);
        if (inferredType !== undefined) {
          addToTypes(inferredType);
        }
      });
    }
    //Should const overwrite the type?
    if (schema.const !== undefined) {
      const inferredType = inferTypeFromValue(schema.const);
      if (inferredType !== undefined) {
        types = inferredType;
      }
    }
  }

  //Infer which types should not be there and include what is left, overwrites what ever has been defined earlier.
  if (schema.not) {
    const notTypes = simplifyTypes(schema.not, seenSchemas);
    const remainingTypes = ['object', 'string', 'number', 'array', 'boolean', 'null'];
    const tryAndCutRemainingArray = (notType: string | undefined) => {
      if (notType !== undefined && remainingTypes.includes(notType)) {
        remainingTypes.splice(remainingTypes.indexOf(notType), 1);
      }
    };
    if (Array.isArray(notTypes)) {
      notTypes.forEach((notType) => {
        tryAndCutRemainingArray(notType);
      });
    } else {
      tryAndCutRemainingArray(notTypes);
    }
    //Assign all remaining types
    types = remainingTypes;
  }

  return types;
}