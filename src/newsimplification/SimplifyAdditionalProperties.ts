import { CommonModel } from 'models';
import { Schema } from 'models/Schema';
import { Simplifier } from './Simplifier';

/**
 * Simplifier function for finding the simplified version of additional properties
 * 
 * @param schema to find extends of
 */
export default function simplifyAdditionalProperties(schema: Schema | boolean, model: CommonModel, simplifier : Simplifier) {
  if (typeof schema !== 'boolean') {
    const newModels = simplifier.simplify(schema.additionalProperties || true);
    if (newModels.length > 0) {
      model.additionalProperties = newModels[0];
    }
  }
}