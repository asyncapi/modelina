import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Interpreter, InterpreterOptions } from './Interpreter';

/**
 * Interpreter function for interpreting JSON Schema draft 7 properties keyword.
 * 
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretProperties(schema: Schema, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (schema.properties === undefined) {return;}
  model.addTypes('object');
  
  for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
    const propertyModel = interpreter.interpret(propertySchema, interpreterOptions);
    if (propertyModel !== undefined) {
      model.addProperty(propertyName, propertyModel, schema);
    }
  }
}

