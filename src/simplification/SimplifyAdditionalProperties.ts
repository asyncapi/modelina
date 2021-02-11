import { CommonModel } from 'models';
import { Schema } from 'models/Schema';
import { isModelObject, Simplifier } from './Simplifier';
type Output = {newModels: CommonModel[] | undefined; additionalProperties: boolean | CommonModel | undefined};

/**
 * Find out which common models we should extend
 * 
 * @param schema to find extends of
 */
export default function simplifyAdditionalProperties(schema: Schema | boolean, simplifier : Simplifier, commonModel: CommonModel) : Output {
  let models : CommonModel[] | undefined;
  const addToModels = (model: CommonModel[] = []) => { models = [...(models || []), ...model]; };
  let additionalProperties: boolean | CommonModel | undefined;
  if (typeof schema !== 'boolean' && isModelObject(commonModel)) {
    if (schema.additionalProperties === false) {
      additionalProperties = undefined;
    } else {
      const newModels = simplifier.simplifyRecursive(schema.additionalProperties || true);
      additionalProperties = newModels[0];
      //If there are more then one model returned, it is extra.
      if (newModels.length > 1) {
        newModels.splice(0, 1);
        addToModels(newModels);
      }
    }
  }
  return {newModels: models, additionalProperties};
}