import { Logger } from '../utils';
import { CommonModel } from '../models';
import {
  Interpreter,
  InterpreterOptions,
  InterpreterSchemaType
} from './Interpreter';
import { isModelObject } from './Utils';

/**
 * Interpreter function for allOf keyword.
 *
 * It either merges allOf schemas into existing model or if allowed, create inheritance.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export default function interpretAllOf(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreter: Interpreter,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (
    typeof schema === 'boolean' ||
    schema.allOf === undefined ||
    schema.oneOf
  ) {
    return;
  }

  for (const subSchema of schema.allOf) {
    const discriminator = interpreter.discriminatorProperty(subSchema);
    if (discriminator !== undefined) {
      interpreterOptions = { ...interpreterOptions, discriminator };
      model.discriminator = discriminator;
    }
  }

  if (
    interpreterOptions.allowInheritance &&
    interpreterOptions.disableCache === true
  ) {
    throw new Error(
      `Inheritance is enabled in combination with allOf but cache is disabled. Inheritance will not work as expected.`
    );
  }

  // Interpret each sub-schema in allOf
  for (const subSchema of schema.allOf) {
    const subModel = interpreter.interpret(subSchema, interpreterOptions);
    if (!subModel) {
      continue;
    }

    // If inheritance is allowed, add subModel as an extended model
    if (interpreterOptions.allowInheritance) {
      const freshModel = interpreter.interpret(subSchema, {
        ...interpreterOptions
      });
      if (freshModel && isModelObject(freshModel)) {
        Logger.info(
          `Processing allOf, inheritance is enabled, ${model.$id} inherits from ${freshModel.$id}`,
          model,
          subModel
        );
        model.addExtendedModel(freshModel);
      }
    }

    Logger.info(
      'Processing allOf, inheritance is not enabled. AllOf model is merged together with already interpreted model',
      model,
      subModel
    );

    interpreter.interpretAndCombineSchema(
      subSchema,
      model,
      schema,
      interpreterOptions
    );
  }
}
