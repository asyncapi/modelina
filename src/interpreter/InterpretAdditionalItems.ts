import { CommonModel } from '../models';
import { Interpreter, InterpreterOptions, interpreterSchemaType } from './Interpreter';

/**
 * Interpreter function for additionalItems keyword.
 * 
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretAdditionalItems(schema: interpreterSchemaType, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (typeof schema === 'boolean' || model.type?.includes('array') === false) {return;}
  const additionalItemsModel = interpreter.interpret(schema.additionalItems === undefined ? true : schema.additionalItems, interpreterOptions);
  if (additionalItemsModel !== undefined) {
    model.addAdditionalItems(additionalItemsModel, schema);
  }
}
