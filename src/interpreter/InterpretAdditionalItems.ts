import { CommonModel } from '../models';
import {
  Interpreter,
  InterpreterOptions,
  InterpreterSchemaType
} from './Interpreter';

/**
 * Interpreter function for additionalItems keyword.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretAdditionalItems(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  const isTuple = model.items !== undefined && Array.isArray(model.items);
  if (
    typeof schema === 'boolean' ||
    model.type?.includes('array') === false ||
    !isTuple
  ) {
    return;
  }
  const hasArrayTypes = schema.items !== undefined;
  let defaultAdditionalItems = true;
  if (hasArrayTypes && interpreterOptions.ignoreAdditionalItems === true) {
    defaultAdditionalItems = false;
  }

  const additionalItemsModel = interpreter.interpret(
    schema.additionalItems === undefined
      ? defaultAdditionalItems
      : schema.additionalItems,
    interpreterOptions
  );
  if (additionalItemsModel !== undefined) {
    model.addAdditionalItems(additionalItemsModel, schema);
  }
}
