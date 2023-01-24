import { CommonModel } from '../models/CommonModel';
import {
  Interpreter,
  InterpreterOptions,
  InterpreterSchemaType
} from './Interpreter';

/**
 * Interpreter function for dependencies keyword.
 *
 * @param schema
 * @param model
 */
export default function interpretDependencies(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (typeof schema === 'boolean' || schema.dependencies === undefined) {
    return;
  }
  for (const dependency of Object.values(schema.dependencies)) {
    // Only handle schema dependency and skip property dependencies
    if (!Array.isArray(dependency)) {
      interpreter.interpretAndCombineSchema(
        dependency as any,
        model,
        schema,
        interpreterOptions
      );
    }
  }
}
