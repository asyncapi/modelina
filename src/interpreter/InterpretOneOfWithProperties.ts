import { CommonModel } from '../models';
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

  const discriminator = interpreter.discriminatorProperty(schema);
  interpreterOptions = {
    ...interpreterOptions,
    discriminator
  };
  model.discriminator = discriminator;

  for (const [propertyName, propertySchema] of Object.entries(
    schema.properties
  )) {
    const propertyModel = interpreter.interpret(
      propertySchema,
      interpreterOptions
    );
    if (propertyModel !== undefined) {
      model.addProperty(propertyName, propertyModel, schema);
    }
  }

  for (const oneOfSchema of schema.oneOf) {
    const oneOfModel = interpreter.interpret(oneOfSchema, interpreterOptions);

    if (!oneOfModel) {
      continue;
    }

    const unionModel = interpreter.interpret(
      {
        ...schema,
        oneOf: undefined
      },
      interpreterOptions
    )!;

    interpreter.interpretAndCombineSchema(
      oneOfSchema,
      unionModel,
      schema,
      interpreterOptions
    );
    model.setType(undefined);
    unionModel.$id = oneOfModel.$id;

    model.addItemUnion(unionModel);
  }
}
