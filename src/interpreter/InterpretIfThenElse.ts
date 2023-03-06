import { CommonModel } from '../models/CommonModel';
import {
  Interpreter,
  InterpreterOptions,
  InterpreterSchemaType
} from './Interpreter';
import { Draft4Schema, Draft6Schema } from '../models';

/**
 * Interpreter function for if/then/else keywords.
 *
 * It merges schemas into existing model
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function InterpretIfThenElse(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (
    typeof schema === 'boolean' ||
    schema instanceof Draft4Schema ||
    schema instanceof Draft6Schema
  ) {
    return;
  }

  if (schema.then) {
    interpretIfThenElseItem(
      schema.then,
      model,
      interpreter,
      interpreterOptions
    );
  }

  if (schema.else) {
    interpretIfThenElseItem(
      schema.else,
      model,
      interpreter,
      interpreterOptions
    );
  }
}

function interpretIfThenElseItem(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions
) {
  if (typeof schema === 'boolean') {
    return;
  }

  schema.required = undefined;

  if (schema.allOf) {
    for (const allOf of schema.allOf) {
      if (typeof allOf === 'boolean') {
        continue;
      }

      allOf.required = undefined;
    }
  }

  interpreter.interpretAndCombineSchema(
    schema,
    model,
    schema,
    interpreterOptions
  );
}
