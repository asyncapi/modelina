import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Interpreter } from './Interpreter';

/**
 * Interpreter function for interpreting JSON Schema draft 7 properties keyword.
 * 
 * @param schema
 * @param model
 * @param interpreter
 */
export default function interpretProperties(schema: Schema, model: CommonModel, interpreter : Interpreter) {
  if (schema.properties === undefined) {return;}
  model.addTypes('object');
  
  for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
    const propertyModels = interpreter.interpret(propertySchema);
    if (propertyModels.length > 0) {
      model.addProperty(propertyName, propertyModels[0], schema);
    }
  }
}

