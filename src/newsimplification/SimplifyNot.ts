
import { Logger } from '../utils';
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { inferNotTypes } from './not/SimplifyTypes';
/**
 * Process JSON Schema draft 7 not keywords
 * 
 * This should negate already simplified keywords
 * 
 * @param schema to find the simplified items for
 * @param simplifier the simplifier instance 
 * @param seenSchemas already seen schemas and their corresponding output, this is to avoid circular schemas
 */
export default function simplifyNot(schema: Schema | boolean, model: CommonModel) {
  if (typeof schema !== 'boolean' && schema.not !== undefined) {
    if (typeof schema.not === 'object') {
      const notSchema = schema.not;

      inferNotTypes(notSchema, model);
      inferNotEnums(notSchema, model);
    } else if (schema.not === true) {
      Logger.warn(`Encountered true not schema. Which rejects everything for ${model.$id}. This schema are not applied!`, schema);
    }
  }
}

/**
 * Infer all enums which the model should NOT contain.
 * 
 * @param notSchema
 * @param model current simplified model
 */
function inferNotEnums(notSchema: Schema, model: CommonModel) {
  if (notSchema.enum !== undefined && model.enum !== undefined) {
    const notEnums = notSchema.enum;
    const filteredEnums = model.enum.filter((el) => {
      return notEnums.indexOf(el) < 0;
    });
    if (filteredEnums.length === 0) {
      model.enum = undefined;
    } else {
      model.enum = filteredEnums;
    }
  }
}
