
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { inferTypeFromValue } from './Utils';

/**
 * Interpreter function for JSON Schema draft 7 enum keyword
 * 
 * @param schema 
 * @param model
 */
export default function interpretEnum(schema: Schema, model: CommonModel): void {
  if (schema.enum === undefined) {return;}
  for (const enumValue of schema.enum) {
    if (schema.type === undefined) {
      const inferredType = inferTypeFromValue(enumValue);
      if (inferredType !== undefined) {
        model.addTypes(inferredType);
      }
    }
    model.addEnum(enumValue);
  }
}
