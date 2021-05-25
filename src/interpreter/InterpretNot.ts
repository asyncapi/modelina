
import { Logger } from '../utils';
import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Interpreter, InterpreterOptions } from './Interpreter';

/**
 * Interpreter function for JSON Schema draft 7 not keyword.
 *   
 * @param schema
 * @param model
 * @param interpreter
 */
export default function interpretNot(schema: Schema, model: CommonModel, interpreter: Interpreter, interpreterOptions: InterpreterOptions) {
  if (schema.not === undefined) return;
  if (typeof schema.not === 'object') {
    const notSchema = schema.not;
    const newInterpreterOptions = {
      ...interpreterOptions, 
      splitModels: false
    };
    const interpretedModels = interpreter.interpret(notSchema, newInterpreterOptions);
    if (interpretedModels.length > 0) {
      const interpretedModel = interpretedModels[0];
      if (interpretedModel.type !== undefined) model.removeType(interpretedModel.type);
      model.removeEnum(interpretedModel.enum);
    }
  } else if (schema.not === true) {
    Logger.warn(`Encountered true not schema. Which rejects everything for ${model.$id}. This schema are not applied!`, schema);
  }
}
