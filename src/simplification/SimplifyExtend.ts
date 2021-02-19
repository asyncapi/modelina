import { CommonModel, Schema } from 'models';
import { Simplifier } from './Simplifier';
type Output =  string[] | undefined;

/**
 * Find out which CommonModels we should extend
 * 
 * @param schema to find extends of
 */
export default function simplifyExtend(schema: Schema | boolean, simplifier : Simplifier) : Output {
  if (!simplifier.options.allowInheritance || typeof schema === 'boolean') return undefined;
  const extendingModels: string[] = [];
  for (const allOfSchema of (schema.allOf || [])) {
    if (typeof allOfSchema !== 'boolean') {
      const simplifiedModels = simplifier.simplify(allOfSchema);
      addExtends(simplifiedModels, extendingModels);
    }
  }
  if (extendingModels.length > 0) {
    return extendingModels;
  }
  return undefined;
}

/**
 * Figure out if the simplified models should be extended
 * 
 * @param simplifiedModels to check if we need to extend
 * @param extendingSchemas already extended CommonModels
 */
function addExtends(simplifiedModels: CommonModel[], alreadyExtendingModels : string[]) {
  if (simplifiedModels.length > 0) {
    //If the root schema is of type object and has an id (should always have one) then extend the model
    const rootSimplifiedModel = simplifiedModels[0];
    if (rootSimplifiedModel.type !== undefined && rootSimplifiedModel.type.includes('object') && rootSimplifiedModel.$id !== undefined) {
      alreadyExtendingModels.push(rootSimplifiedModel.$id);
    }
  }
}