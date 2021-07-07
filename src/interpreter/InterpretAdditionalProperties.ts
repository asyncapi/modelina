import { CommonModel } from '../models';
import { Schema } from '../models/Schema';
import { Interpreter, InterpreterOptions } from './Interpreter';
import { isModelObject } from './Utils';

/**
 * Interpreter function for JSON Schema draft 7 additionalProperties keyword.
 * 
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretAdditionalProperties(schema: Schema, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (isModelObject(model) === false) {return;}
  const additionalPropertiesModel = interpreter.interpret(schema.additionalProperties === undefined ? true : schema.additionalProperties, interpreterOptions);
  if (additionalPropertiesModel !== undefined) {
    model.addAdditionalProperty(additionalPropertiesModel, schema);
  }
}
