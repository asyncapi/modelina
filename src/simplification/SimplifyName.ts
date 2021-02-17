import { Schema } from '../models/Schema';

/**
 * Find the name for simplified version of schema
 * 
 * @param schema to find the name
 */
export default function simplifyName(schema: Schema | boolean): string | undefined {
  if (typeof schema === 'boolean') {
    return undefined;
  }
  return schema.$id || schema.title;
}
