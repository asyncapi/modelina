import { CommonModel } from '../models';
import { Schema } from '../models/Schema';
import { Interpreter, InterpreterOptions } from './Interpreter';

/**
 * Interpreter function for JSON Schema draft 7 patternProperties keyword.
 * 
 * @param schema
 * @param model
 * @param interpreter
 * @param options to control the interpret process
 */
export default function interpretPatternProperties(schema: Schema | boolean, model: CommonModel, interpreter : Interpreter, interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions) {
  if (typeof schema === 'boolean') return;
  for (const [pattern, patternSchema] of Object.entries(schema.patternProperties || {})) {
    const newModels = interpreter.interpret(patternSchema, interpreterOptions);
    if (newModels.length > 0) {
      model.addPatternProperty(pattern, newModels[0], schema);
    }
  }
}
