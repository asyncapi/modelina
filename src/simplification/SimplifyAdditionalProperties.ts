import { CommonModel } from 'models';
import { Schema } from 'models/Schema';
import { isModelObject, Simplifier } from './Simplifier';
type Output = CommonModel | undefined;

/**
 * Find out which common models we should extend
 * 
 * @param schema to find extends of
 */
export default function simplifyAdditionalProperties(schema: Schema | boolean, simplifier : Simplifier, commonModel: CommonModel) : Output {
  let additionalProperties: Output;
  if (typeof schema !== 'boolean' && isModelObject(commonModel)) {
    if (schema.additionalProperties === false) {
      additionalProperties = undefined;
    } else {
      const newModels = simplifier.simplify(schema.additionalProperties || true);
      additionalProperties = newModels[0];
    }
  }
  return additionalProperties;
}