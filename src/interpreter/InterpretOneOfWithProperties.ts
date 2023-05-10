import {
  CommonModel,
  AsyncapiV2Schema,
  OpenapiV3Schema,
  SwaggerV2Schema
} from '../models';
import {
  Interpreter,
  InterpreterOptions,
  InterpreterSchemaType
} from './Interpreter';

/**
 * Interpreter function for oneOf keyword combined with properties.
 *
 * It merges the properties of the schema into the oneOf schemas. Shared properties are merged. The oneOf schemas are then added as union to the model.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretOneOfWithProperties(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (
    typeof schema === 'boolean' ||
    !schema.oneOf ||
    !schema.properties ||
    schema.allOf
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

    if (!oneOfModel) {
      continue;
    }

    const schemaModel = interpreter.interpret(
      {
        ...schema,
        oneOf: undefined
      },
      interpreterOptions
    );

    if (!schemaModel) {
      continue;
    }

    interpreter.interpretAndCombineSchema(
      oneOfSchema,
      schemaModel,
      schema,
      interpreterOptions
    );
    model.setType(undefined);
    schemaModel.$id = oneOfModel.$id;

    model.addItemUnion(schemaModel);
  }
}
