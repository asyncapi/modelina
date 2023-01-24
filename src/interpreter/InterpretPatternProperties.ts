import { CommonModel } from '../models';
import {
  Interpreter,
  InterpreterOptions,
  InterpreterSchemaType
} from './Interpreter';

/**
 * Interpreter function for patternProperties keyword.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretPatternProperties(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (typeof schema === 'boolean') {
    return;
  }
  for (const [pattern, patternSchema] of Object.entries(
    schema.patternProperties || {}
  )) {
    const patternModel = interpreter.interpret(
      patternSchema as any,
      interpreterOptions
    );
    if (patternModel !== undefined) {
      model.addPatternProperty(pattern, patternModel, schema);
    }
  }
}
