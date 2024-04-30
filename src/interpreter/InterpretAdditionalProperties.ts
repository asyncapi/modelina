import { CommonModel } from '../models';
import {
  Interpreter,
  InterpreterOptions,
  InterpreterSchemaType
} from './Interpreter';
import { isModelObject } from './Utils';

/**
 * Interpreter function for additionalProperties keyword.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretAdditionalProperties(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (
    typeof schema === 'boolean' ||
    (model.type !== undefined && isModelObject(model) === false)
  ) {
    return;
  }
  let defaultAdditionalProperties = true;
  const hasProperties = Object.keys(schema.properties || {}).length > 0;
  //Only ignore additionalProperties if the schema already has properties defined, otherwise its gonna be interpreted as a map
  if (hasProperties && interpreterOptions.ignoreAdditionalProperties === true) {
    defaultAdditionalProperties = false;
  }

  const additionalProperties =
    schema.additionalProperties === undefined
      ? defaultAdditionalProperties
      : schema.additionalProperties;

  const additionalPropertiesModel = interpreter.interpret(
    additionalProperties,
    interpreterOptions
  );

  if (additionalPropertiesModel !== undefined) {
    model.addAdditionalProperty(additionalPropertiesModel, schema);
  }
}
