import { Draft4Schema, CommonModel } from '../models';
import { InterpreterSchemaType } from './Interpreter';
import { inferTypeFromValue } from './Utils';

/**
 * Interpreter function for const keyword for draft version > 4
 *
 * @param schema
 * @param model
 */
export default function interpretConst(
  schema: InterpreterSchemaType,
  model: CommonModel
): void {
  if (
    schema instanceof Draft4Schema ||
    typeof schema === 'boolean' ||
    schema.const === undefined
  ) {
    return;
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
