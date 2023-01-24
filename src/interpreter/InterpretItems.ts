import { CommonModel } from '../models/CommonModel';
import {
  Interpreter,
  InterpreterOptions,
  InterpreterSchemaType
} from './Interpreter';

/**
 * Interpreter function for items keyword.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretItems(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (typeof schema === 'boolean' || schema.items === undefined) {
    return;
  }
  model.addTypes('array');
  interpretArrayItems(
    schema,
    schema.items,
    model,
    interpreter,
    interpreterOptions
  );
}

/**
 * Internal function to process all item schemas
 *
 * @param rootSchema
 * @param itemSchemas
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
function interpretArrayItems(
  rootSchema: InterpreterSchemaType,
  itemSchemas: InterpreterSchemaType[] | InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (Array.isArray(itemSchemas)) {
    for (const [index, itemSchema] of itemSchemas.entries()) {
      const itemModel = interpreter.interpret(itemSchema, interpreterOptions);
      if (itemModel !== undefined) {
        model.addItemTuple(itemModel, rootSchema, index);
      }
    }
  } else {
    const itemModel = interpreter.interpret(itemSchemas, interpreterOptions);
    if (itemModel !== undefined) {
      model.addItem(itemModel, rootSchema);
    }
  }
}
