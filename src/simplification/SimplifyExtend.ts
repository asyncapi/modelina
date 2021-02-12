import { Schema } from 'models/Schema';
import { Simplifier } from './Simplifier';
type Output = string[] | undefined;

/**
 * Find out which common models we should extend
 * 
 * @param schema to find extends of
 */
export default function simplifyExtend(schema: Schema | boolean, simplifier : Simplifier) : Output {
  let extendingSchemas : string[] | undefined;
  if (typeof schema !== 'boolean' && schema.allOf !== undefined) {
    for (const allOfSchema of schema.allOf) {
      if (typeof allOfSchema !== 'boolean') {
        const simplifiedModels = simplifier.simplify(allOfSchema);
        if (simplifiedModels.length > 0) {
          //If the root schema is of type object and has an id (should always have one) then extend the model
          const rootSimplifiedModel = simplifiedModels[0];
          if (rootSimplifiedModel.type !== undefined && rootSimplifiedModel.type.includes('object') && rootSimplifiedModel.$id !== undefined) {
            extendingSchemas = [...(extendingSchemas || []), rootSimplifiedModel.$id];
          }
        }
      }
    }
  }
  return extendingSchemas;
}