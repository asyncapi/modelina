import { CommonModel } from '../models';
import { Interpreter, InterpreterOptions, interpreterSchemaType } from './Interpreter';
import { isModelObject } from './Utils';

/**
 * Interpreter function for additionalProperties keyword.
 * 
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretAdditionalProperties(schema: interpreterSchemaType, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (typeof schema === 'boolean' || isModelObject(model) === false) {return;}
  const additionalPropertiesModel = interpreter.interpret(schema.additionalProperties === undefined ? true : schema.additionalProperties, interpreterOptions);
  if (additionalPropertiesModel !== undefined) {
    model.addAdditionalProperty(additionalPropertiesModel, schema);
  }
}
