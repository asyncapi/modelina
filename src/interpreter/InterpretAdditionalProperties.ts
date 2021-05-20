import { CommonModel } from 'models';
import { Schema } from 'models/Schema';
import { Interpreter } from './Interpreter';
import { isModelObject } from './Utils';

/**
 * Interpreter function for JSON Schema draft 7 additionalProperties keyword.
 * 
 * @param schema
 * @param model
 * @param interpreter
 */
export default function interpretAdditionalProperties(schema: Schema | boolean, model: CommonModel, interpreter : Interpreter) {
  if (typeof schema !== 'boolean' && isModelObject(model)) {
    const newModels = interpreter.interpret(schema.additionalProperties || true);
    if (newModels.length > 0) {
      model.additionalProperties = newModels[0];
    }
  }
}