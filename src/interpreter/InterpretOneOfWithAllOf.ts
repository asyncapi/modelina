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
 * Interpreter function for oneOf keyword combined with the allOf keyword.
 *
 * It merges the allOf schemas into all of the oneOf schemas. Shared properties are merged. The oneOf schemas are then added as union to the model.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
export default function interpretOneOfWithAllOf(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (
    typeof schema === 'boolean' ||
    !schema.oneOf ||
    !schema.allOf ||
    schema.properties ||
    interpreterOptions.allowInheritance
  ) {
    return;
  }

  for (const allOfSchema of schema.allOf) {
    if (
      (allOfSchema instanceof AsyncapiV2Schema ||
        allOfSchema instanceof SwaggerV2Schema) &&
      allOfSchema.discriminator
    ) {
      interpreterOptions = {
        ...interpreterOptions,
        discriminator: allOfSchema.discriminator
      };

      model.discriminator = allOfSchema.discriminator;
    } else if (
      allOfSchema instanceof OpenapiV3Schema &&
      allOfSchema.discriminator &&
      allOfSchema.discriminator.propertyName
    ) {
      interpreterOptions = {
        ...interpreterOptions,
        discriminator: allOfSchema.discriminator.propertyName
      };

      model.discriminator = allOfSchema.discriminator.propertyName;
    }
  }

  for (const oneOfSchema of schema.oneOf) {
    const oneOfModel = interpreter.interpret(oneOfSchema, interpreterOptions);

    if (!oneOfModel) {
      continue;
    }

    const [firstAllOfSchema, ...allOfSchemas] = schema.allOf;

    if (typeof firstAllOfSchema === 'boolean') {
      continue;
    }

    const allOfModel = interpreter.interpret(
      { ...firstAllOfSchema },
      interpreterOptions
    );

    if (!allOfModel) {
      continue;
    }

    for (const allOfSchema of allOfSchemas) {
      interpreter.interpretAndCombineSchema(
        allOfSchema,
        allOfModel,
        firstAllOfSchema,
        interpreterOptions
      );
    }

    interpreter.interpretAndCombineSchema(
      oneOfSchema,
      allOfModel,
      firstAllOfSchema,
      interpreterOptions
    );
    allOfModel.$id = oneOfModel.$id;

    model.addItemUnion(allOfModel);
  }
}
