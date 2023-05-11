import {
  Draft4Schema,
  CommonModel,
  AsyncapiV2Schema,
  SwaggerV2Schema,
  OpenapiV3Schema
} from '../models';
import {
  Interpreter,
  InterpreterOptions,
  InterpreterSchemaType
} from './Interpreter';
import { inferTypeFromValue } from './Utils';

/**
 * Interpreter function for const keyword for draft version > 4
 *
 * @param schema
 * @param model
 * @param interpreterOptions to control the interpret process
 */
export default function interpretConst(
  schema: InterpreterSchemaType,
  model: CommonModel,
  interpreterOptions: InterpreterOptions = Interpreter.defaultInterpreterOptions
): void {
  if (
    schema instanceof Draft4Schema ||
    typeof schema === 'boolean' ||
    schema.const === undefined
  ) {
    return;
  }

  if (
    (schema instanceof AsyncapiV2Schema ||
      schema instanceof SwaggerV2Schema ||
      schema instanceof OpenapiV3Schema) &&
    interpreterOptions.discriminator
  ) {
    model.enum = [schema.const];
  }

  model.const = schema.const;

  //If schema does not contain type interpret the schema
  if (schema.type === undefined) {
    const inferredType = inferTypeFromValue(schema.const);
    if (inferredType !== undefined) {
      model.setType(inferredType);
    }
  }
}
