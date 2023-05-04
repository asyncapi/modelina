import { Logger } from '../utils';
import { CommonModel, AsyncapiV2Schema } from '../models';
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

  for (const allOfSchema of schema.allOf) {
    if (allOfSchema instanceof AsyncapiV2Schema && allOfSchema.discriminator) {
      interpreterOptions = {
        ...interpreterOptions,
        discriminator: allOfSchema.discriminator
      };

      model.discriminator = allOfSchema.discriminator;
    }
  }

  for (const allOfSchema of schema.allOf) {
    const allOfModel = interpreter.interpret(allOfSchema, interpreterOptions);
    if (allOfModel === undefined) {
      continue;
    }
    if (
      isModelObject(allOfModel) === true &&
      interpreterOptions.allowInheritance === true
    ) {
      Logger.info(
        `Processing allOf, inheritance is enabled, ${model.$id} inherits from ${allOfModel.$id}`,
        model,
        allOfModel
      );
      model.addExtendedModel(allOfModel);
    } else {
      Logger.info(
        'Processing allOf, inheritance is not enabled. AllOf model is merged together with already interpreted model',
        model,
        allOfModel
      );
      interpreter.interpretAndCombineSchema(
        allOfSchema,
        model,
        schema,
        interpreterOptions
      );
    }
  }
}
