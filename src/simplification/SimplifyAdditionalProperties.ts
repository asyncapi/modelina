import { CommonModel } from 'models';
import { Schema } from 'models/Schema';
import { Simplifier } from './Simplifier';
import { isModelObject } from './Utils';
type Output = CommonModel | undefined;

/**
 * Simplifier function for finding the simplified version of additional properties
 * 
 * @param schema to find extends of
 */
export default function simplifyAdditionalProperties(schema: Schema | boolean, simplifier : Simplifier, commonModel: CommonModel) : Output {
  let additionalProperties: Output;
  if (typeof schema !== 'boolean' && isModelObject(commonModel)) {
    if (schema.additionalProperties === false) 
      additionalProperties = undefined;
    else {
      const newModels = simplifier.simplify(schema.additionalProperties || true);
      if (newModels.length > 0) 
        additionalProperties = newModels[0];
    }
  }
  return additionalProperties;
}
