import { CommonModel } from 'models';
import { Schema } from 'models/Schema';
import { Simplifier } from './Simplifier';
import { isModelObject } from './Utils';
type Output = CommonModel | undefined;

/**
 * Find out which common models we should extend
 * 
 * @param schema to find extends of
 */
export default function simplifyAdditionalProperties(schema: Schema | boolean, simplifier : Simplifier, commonModel: CommonModel) : Output {
  let additionalProperties: Output;
  if (typeof schema !== 'boolean' && isModelObject(commonModel)) {
    if (schema.additionalProperties !== false) {
      const newModels = simplifier.simplify(schema.additionalProperties || true);
      if (newModels.length > 0) {
        additionalProperties = newModels[0];
      }
    }

    if (schema.patternProperties !== undefined) {
      for (const [pattern, patternSchema] in schema.patternProperties) {
        const newModels = simplifier.simplify(schema.additionalProperties || true);
        if (newModels.length > 0) {
          additionalProperties = newModels[0];
        }
      }
    }
  }
  return additionalProperties;
}