import { CommonModel } from '../models/CommonModel';
import {
  Interpreter,
  InterpreterOptions,
  InterpreterSchemaType
} from './Interpreter';

/**
 * Interpreter function for interpreting properties keyword.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretProperties(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (
    typeof schema === 'boolean' ||
    schema.properties === undefined ||
    schema.oneOf
  ) {
    return;
  }
  model.addTypes('object');

  for (const [propertyName, propertySchema] of Object.entries(
    schema.properties
  )) {
    const discriminator =
      propertyName === interpreterOptions.discriminator
        ? interpreterOptions.discriminator
        : undefined;

    if (discriminator) {
      model.discriminator = discriminator;
    }

    const propertyModel = interpreter.interpret(propertySchema, {
      ...interpreterOptions,
      discriminator
    });
    if (propertyModel !== undefined) {
      if (model.required?.includes(propertyName)) {
        propertyModel.propertyIsRequired = true;
      }
      model.addProperty(propertyName, propertyModel, schema);
    }
  }
}
