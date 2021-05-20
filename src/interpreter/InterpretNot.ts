
import { Logger } from '../utils';
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Interpreter } from './Interpreter';
/**
 * Interpreter function for JSON Schema draft 7 not keyword.
 *   
 * @param schema
 * @param model
 * @param interpreter
 */
export default function interpretNot(schema: Schema, model: CommonModel, interpreter: Interpreter) {
  if (schema.not === undefined) return;
  if (typeof schema.not === 'object') {
    const notSchema = schema.not;
    if (notSchema.type !== undefined) model.removeType(notSchema.type);
    inferNotEnums(notSchema, model);

    //Nested not schemas works as a regular schema
    if (notSchema.not !== undefined) {
      const nestedNotModels = interpreter.interpret(notSchema.not, false);
      if (nestedNotModels.length > 0) {
        CommonModel.mergeCommonModels(model, nestedNotModels[0], schema);
      }
    }
  } else if (schema.not === true) {
    Logger.warn(`Encountered true not schema. Which rejects everything for ${model.$id}. This schema are not applied!`, schema);
  }
}

/**
 * Infer all enums which the model should NOT contain.
 * 
 * @param notSchema
 * @param model current simplified model
 */
function inferNotEnums(notSchema: Schema, model: CommonModel) {
  if (notSchema.enum === undefined || model.enum === undefined) return;
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
