
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
    model.removeEnum(notSchema.enum);
    model.removeEnum(notSchema.const);

    //Nested not schemas works as a regular schema where it imply models
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
