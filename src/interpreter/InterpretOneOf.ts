import { CommonModel } from '../models/CommonModel';
import {
  Interpreter,
  InterpreterOptions,
  InterpreterSchemaType
} from './Interpreter';

/**
 * Interpreter function for oneOf keyword.
 *
 * It puts the schema reference into the items field.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretOneOf(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (
    typeof schema === 'boolean' ||
    schema.oneOf === undefined ||
    schema.allOf ||
    schema.properties
  ) {
    return;
  }
  let nullModel;
  for (const oneOfSchema of schema.oneOf) {
    const oneOfModel = interpreter.interpret(oneOfSchema, interpreterOptions);
    if (oneOfModel === undefined) {
      continue;
    }
    if (oneOfModel.type === 'null') {
      nullModel = oneOfModel;
    } else {
      model.addItemUnion(oneOfModel);
    }
  }
  if (nullModel) {
    for (const unionModel of model.union || []) {
      unionModel.addTypes('null');
    }
    model.addTypes('null');
  }
}
