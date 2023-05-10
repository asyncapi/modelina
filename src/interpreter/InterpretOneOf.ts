import {
  AsyncapiV2Schema,
  CommonModel,
  OpenapiV3Schema,
  SwaggerV2Schema
} from '../models';
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

  if (
    (schema instanceof AsyncapiV2Schema || schema instanceof SwaggerV2Schema) &&
    schema.discriminator
  ) {
    interpreterOptions = {
      ...interpreterOptions,
      discriminator: schema.discriminator
    };

    model.discriminator = schema.discriminator;
  } else if (
    schema instanceof OpenapiV3Schema &&
    schema.discriminator &&
    schema.discriminator.propertyName
  ) {
    interpreterOptions = {
      ...interpreterOptions,
      discriminator: schema.discriminator.propertyName
    };

    model.discriminator = schema.discriminator.propertyName;
  }

  for (const oneOfSchema of schema.oneOf) {
    const oneOfModel = interpreter.interpret(oneOfSchema, interpreterOptions);
    if (oneOfModel === undefined) {
      continue;
    }

    if (oneOfModel.discriminator) {
      model.discriminator = oneOfModel.discriminator;
    }

    model.addItemUnion(oneOfModel);
  }
}
