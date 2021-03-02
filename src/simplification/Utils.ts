import { CommonModel } from '../models/CommonModel';

/**
 * check if CommonModel is a separate model or a simple model.
 */
export function isModelObject(model: CommonModel) : boolean {
  // This check should be done instead, needs a refactor to allow it though:
  // this.extend !== undefined || this.properties !== undefined
  if (model.type !== undefined) {
    // If all possible JSON types are defined, don't split it even if it does contain object.
    if (Array.isArray(model.type) && model.type.length === 7) {
      return false;
    }
    return model.type.includes('object');
  }
  return false;
}