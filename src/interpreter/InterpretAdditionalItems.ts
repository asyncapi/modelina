import { CommonModel } from '../models';
import { Schema } from '../models/Schema';
import { Interpreter, InterpreterOptions } from './Interpreter';

/**
 * Interpreter function for JSON Schema draft 7 additionalProperties keyword.
 * 
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretAdditionalItems(schema: Schema, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (model.type?.includes('array') === false) {return;}
  const additionalItemsModel = interpreter.interpret(schema.additionalItems === undefined ? true : schema.additionalItems, interpreterOptions);
  if (additionalItemsModel !== undefined) {
    model.addAdditionalItems(additionalItemsModel, schema);
  }
}
