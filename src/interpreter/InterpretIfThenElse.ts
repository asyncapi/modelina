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
  thenOrElseSchema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions
) {
  if (
    typeof thenOrElseSchema === 'boolean' ||
    thenOrElseSchema instanceof Draft4Schema ||
    thenOrElseSchema instanceof Draft6Schema
  ) {
    return;
  }

  interpreter.interpretAndCombineSchema(
    thenOrElseSchema,
    model,
    thenOrElseSchema,
    interpreterOptions,
    {
      constrictModels: false
    }
  );
}
