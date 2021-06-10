
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
 * @param interpreterOptions to control the interpret process
 */
export default function interpretNot(schema: Schema, model: CommonModel, interpreter: Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (schema.not === undefined) {return;}
  if (typeof schema.not === 'object') {
    const notSchema = schema.not;
    const newInterpreterOptions: InterpreterOptions = {
      ...interpreterOptions,
      allowInheritance: false
    };
    const notModel = interpreter.interpret(notSchema, newInterpreterOptions);
    if (notModel !== undefined) {
      if (notModel.type !== undefined) {model.removeType(notModel.type);}
      if (notModel.enum !== undefined) {model.removeEnum(notModel.enum);}
    }
  } else if (typeof schema.not === 'boolean') {
    Logger.warn(`Encountered boolean not schema for model ${model.$id}. This schema are not applied!`, schema);
  }
}
