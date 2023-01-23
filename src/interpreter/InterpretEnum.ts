import { CommonModel } from '../models/CommonModel';
import { InterpreterSchemaType } from './Interpreter';
import { inferTypeFromValue } from './Utils';

/**
 * Interpreter function for enum keyword
 *
 * @param schema
 * @param model
 */
export default function interpretEnum(
  schema: InterpreterSchemaType,
  model: CommonModel
): void {
  if (typeof schema === 'boolean' || schema.enum === undefined) {
    return;
  }
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
