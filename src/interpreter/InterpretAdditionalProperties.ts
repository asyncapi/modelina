import { CommonModel } from 'models';
import { Schema } from 'models/Schema';
import { Interpreter, InterpreterOptions } from './Interpreter';
import { isModelObject } from './Utils';

/**
 * Interpreter function for JSON Schema draft 7 additionalProperties keyword.
 * 
 * @param schema
 * @param model
 * @param interpreter
 */
export default function interpretAdditionalProperties(schema: Schema, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions) {
  if (!isModelObject(model)) {return;}
  const newModels = interpreter.interpret(schema.additionalProperties || true, interpreterOptions);
  if (newModels.length > 0) {
    model.addAdditionalProperty(newModels[0], schema);
  }
}
