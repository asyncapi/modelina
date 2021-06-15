import { CommonModel } from '../models/CommonModel';
import { Schema } from '../models/Schema';
import { Interpreter, InterpreterOptions } from './Interpreter';

/**
 * Interpreter function for JSON Schema draft 7 dependencies keyword.
 * 
 * @param schema 
 * @param model
 */
export default function interpretDependencies(schema: Schema, model: CommonModel, interpreter: Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions): void {
  if (schema.dependencies === undefined) {return;}
  for (const dependency of Object.values(schema.dependencies)) {
    // Only handle schema dependency and skip property dependencies
    if (!Array.isArray(dependency)) {
      interpreter.interpretAndCombineSchema(dependency, model, schema, interpreterOptions);
    }
  }
}
