
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Simplifier } from './Simplifier';

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
      
      //Negate the already negated
      if (notSchema.not !== undefined) {
        //We have to use a clean instance so the model is never saved to the output.
        const s = new Simplifier(); 
        const doubleNegatedModel = s.simplify(notSchema.not);
        if (doubleNegatedModel.length > 0) {
          model = CommonModel.mergeCommonModels(model, doubleNegatedModel[0], schema);
        }
      }
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

/**
 * Infer all types which the model should NOT contain.
 * 
 * @param notSchema
 * @param model current simplified model
 */
function inferNotTypes(notSchema: Schema, model: CommonModel) {
  if (notSchema.type !== undefined && model.type !== undefined) {
    const notTypes = Array.isArray(notSchema.type) ? (notSchema.type) : [notSchema.type] || [];
    const filteredTypes = [...model.type].filter((el) => {
      return notTypes.indexOf(el) < 0;
    });
    if (filteredTypes.length === 0) {
      model.type = undefined;
    } else if (filteredTypes.length === 1) {
      model.type = filteredTypes[0];
    } else {
      model.type = filteredTypes;
    }
  }
}
