import { Schema } from 'models/Schema';

type Output = string[] | undefined;

/**
 * Find the required array for a simplified version of a schema
 * 
 * @param schema to find the simplified required array for
 * @param seenSchemas already seen schemas, this is to avoid circular schemas
 */
export default function simplifyRequired(schema: Schema | boolean, seenSchemas: Set<any> = new Set()): Output {
  // use Set, because we don't need cache any reference to previous simplified values
  if (
    typeof schema === 'boolean' ||
    seenSchemas.has(schema)
  ) {
    return undefined;
  }
  seenSchemas.add(schema);

  let required: Output = schema.required;
  const addRequired = (r: Output) => {
    if (r !== undefined) {
      required = required || [];
      required.push(...r);
    }
  };
  const handler = (schemas: (Schema | boolean)[] = []) => {
    schemas.forEach((schema) => {
      addRequired(simplifyRequired(schema, seenSchemas));
    });
  };

  handler(schema.allOf);
  handler(schema.oneOf);
  handler(schema.anyOf);

  if (schema.then) {
    addRequired(simplifyRequired(schema.then, seenSchemas));
  }
  if (schema.else) {
    addRequired(simplifyRequired(schema.else, seenSchemas));
  }

  // remove duplication
  if (Array.isArray(required)) {
    return [...new Set(required)];
  }
  return undefined;
}
