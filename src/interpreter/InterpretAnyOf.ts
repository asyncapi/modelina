import { CommonModel } from '../models/CommonModel';
import {
  Interpreter,
  InterpreterOptions,
  InterpreterSchemaType
} from './Interpreter';

/**
 * Interpreter function for anyOf keyword.
 *
 * It puts the schema reference into the items field.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretAnyOf(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (typeof schema === 'boolean' || schema.anyOf === undefined) {
    return;
  }
  for (const anyOfSchema of schema.anyOf) {
    const anyOfModel = interpreter.interpret(anyOfSchema, interpreterOptions);
    if (anyOfModel === undefined) {
      continue;
    }
    model.addItemUnion(anyOfModel);
  }
}
