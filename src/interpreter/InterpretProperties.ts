import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Interpreter, InterpreterOptions } from './Interpreter';

/**
 * Interpreter function for interpreting JSON Schema draft 7 properties keyword.
 * 
 * @param schema
 * @param model
 * @param interpreter
 * @param options to control the interpret process
 */
export default function interpretProperties(schema: Schema, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (schema.properties === undefined) {return;}
  model.addTypes('object');
  
  for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
    const propertyModels = interpreter.interpret(propertySchema, interpreterOptions);
    if (propertyModels.length > 0) {
      model.addProperty(propertyName, propertyModels[0], schema);
    }
  }
}

