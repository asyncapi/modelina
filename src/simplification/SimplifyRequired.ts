import { Schema } from 'models/Schema';

type Output = string[] | undefined;

/**
 * Find the required array for a simplified version of a schema
 * 
 * @param schema to find the simplified required array for
 * @param seenSchemas already seen schemas, this is to avoid circular schemas
 */
export default function simplifyRequired(schema: Schema | boolean, seenSchemas: Set<any> = new Set()): Output {
  if (
    typeof schema === 'boolean' ||
    seenSchemas.has(schema)
  ) {
    return undefined;
  }
  seenSchemas.add(schema);

  let required: Output = schema.required;
  const addRequired = (r: Output) => {
    required = required || [];
    if (r !== undefined) {
      required.push(...r);
    }
  }
  const handler = (schemas: (Schema | boolean)[] = []) => {
    schemas.forEach((schema) => {
      addRequired(simplifyRequired(schema, seenSchemas));
    });
  };

  handler(schema.allOf);
  handler(schema.oneOf);
  handler(schema.anyOf);

  schema.then && addRequired(simplifyRequired(schema.then, seenSchemas));
  schema.else && addRequired(simplifyRequired(schema.else, seenSchemas));

  // remove duplication
  return [...new Set(required)];
}