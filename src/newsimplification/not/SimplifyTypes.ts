import { Schema, CommonModel } from '../../models';

/**
 * Infer all types which the model should NOT contain.
 * 
 * Nested not schemas excludes/includes types respectfully dependant on how nested they are.
 * nested level is odd = exclude
 * nested level is even = include 
 * 
 * @param rootNotSchema schema which should 
 * @param model current simplified model
 */
export function inferNotTypes(rootNotSchema: Schema, model: CommonModel) {
  if (rootNotSchema.type !== undefined && model.type !== undefined) {
    model.type = Array.isArray(model.type) ? model.type : [model.type];
    const modelTypes: Set<string> = new Set(model.type);
    excludeTypes(modelTypes, rootNotSchema);
    model.setType([...modelTypes]);
  }
}

/**
 * Exclude types from the model
 * 
 * if nested not schemas are found we include them once again.
 * 
 * @param modelTypes set of types which the model current states
 * @param notSchema  
 */
function excludeTypes(modelTypes: Set<string>, notSchema: Schema) {
  if (notSchema.type !== undefined) {
    const nonAllowedTypes = Array.isArray(notSchema.type) ? notSchema.type : [notSchema.type];
    const removedTypes: string[] = [];
    nonAllowedTypes.forEach((nonAllowedType) => {
      if (modelTypes.has(nonAllowedType)) {
        modelTypes.delete(nonAllowedType);
        removedTypes.push(nonAllowedType);
      }
    });
    if (typeof notSchema.not === 'object') {
      includeTypes(modelTypes, removedTypes, notSchema.not);
    }
  }
}

/**
 * Include already excluded types
 * 
 * @param modelTypes 
 * @param excludedTypes types which have already been excluded from the model
 * @param nestedNotSchema 
 */
function includeTypes(modelTypes: Set<string>, excludedTypes: string[], nestedNotSchema: Schema) {
  if (nestedNotSchema.type !== undefined) {
    const allowedTypes = Array.isArray(nestedNotSchema.type) ? nestedNotSchema.type : [nestedNotSchema.type];
    allowedTypes.forEach((type) => {
      if (excludedTypes.indexOf(type) > -1) {
        modelTypes.add(type);
      }
    });
    if (typeof nestedNotSchema.not === 'object') {
      excludeTypes(modelTypes, nestedNotSchema.not);
    }
  }
}