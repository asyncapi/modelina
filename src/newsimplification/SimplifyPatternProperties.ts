import { CommonModel } from '../models';
import { Schema } from '../models/Schema';
import { Simplifier } from './Simplifier';
/**
 * Find out which common models we should extend
 * 
 * @param schema to find extends of
 */
export default function simplifyPatternProperties(schema: Schema | boolean, model: CommonModel, simplifier : Simplifier) {
  if (typeof schema !== 'boolean') {
    for (const [pattern, patternSchema] of Object.entries(schema.patternProperties || {})) {
      const newModels = simplifier.simplify(patternSchema);
      if (newModels.length > 0) {
        if (model.patternProperties ===  undefined) model.patternProperties = {};
        const patternModel = newModels[0];
        if (model.patternProperties[`${pattern}`] !== undefined) {
          model.patternProperties[`${pattern}`] = CommonModel.mergeCommonModels(model.patternProperties[`${pattern}`], patternModel, schema);
        } else {
          model.patternProperties[`${pattern}`] = patternModel;
        }
      }
    }
  }
}