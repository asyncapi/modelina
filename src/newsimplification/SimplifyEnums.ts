
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { inferTypeFromValue } from './Utils';

/**
 * Process JSON Schema draft 7 enums
 * 
 * @param schema to find the simplified items for
 * @param simplifier the simplifier instance 
 * @param seenSchemas already seen schemas and their corresponding output, this is to avoid circular schemas
 */
export default function simplifyEnums(schema: Schema | boolean, model: CommonModel) {
  if (typeof schema !== 'boolean' && schema.enum !== undefined) {
    const enums: any[] = [];
    schema.enum.forEach((enumValue) => {
      if (schema.type === undefined) {
        // Infer type from enum values
        const inferredType = inferTypeFromValue(enumValue);
        if (inferredType !== undefined) {
          model.addToTypes(inferredType);
        }
      }
      if (!enums.includes(enumValue)) {
        enums.push(enumValue);
      }
    });
    model.enum = enums; 
  }
}
