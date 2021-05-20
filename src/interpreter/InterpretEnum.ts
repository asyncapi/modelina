
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { inferTypeFromValue } from './Utils';

/**
 * Interpreter function for JSON Schema draft 7 enum keyword
 * 
 * @param schema 
 * @param model
 */
export default function interpretEnum(schema: Schema, model: CommonModel) {
  if (schema.enum === undefined) return;
  schema.enum.forEach((enumValue) => {
    if (schema.type === undefined) {
      // Infer type from enum values
      const inferredType = inferTypeFromValue(enumValue);
      if (inferredType !== undefined) {
        model.addTypes(inferredType);
      }
    }
    if (model.enum === undefined) model.enum = [];
    if (!model.enum.includes(enumValue)) {
      model.enum.push(enumValue);
    }
  });
}
