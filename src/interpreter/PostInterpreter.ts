import { CommonModel } from '../models';
import { Logger } from '../utils';
import { isModelObject } from './Utils';
/**
 * Post process the interpreted model. By applying the following:
 * - Ensure models are split as required
 * 
 * @param model 
 */
export function postInterpretModel(model: CommonModel): CommonModel[] {
  const iteratedModels: CommonModel[] = [];
  ensureModelsAreSplit(model, iteratedModels);
  return iteratedModels;
}

/**
 * This function splits up a model if needed and add the new model to the list of models.
 * 
 * @param model check if it should be split up
 * @param iteratedModels which have already been split up
 */
function trySplitModels(model: CommonModel, iteratedModels: CommonModel[]): CommonModel {
  if (isModelObject(model)) {
    Logger.info(`Splitting model ${model.$id || 'any'} since it should be on its own`);
    const switchRootModel = new CommonModel();
    switchRootModel.$ref = model.$id;
    ensureModelsAreSplit(model, iteratedModels);
    return switchRootModel;
  }
  return model;
}

/**
 * Split up all models which should and use ref instead.
 * 
 * @param model to ensure are split
 * @param iteratedModels which are already split
 */
function ensureModelsAreSplit(model: CommonModel, iteratedModels: CommonModel[]): void {
  // eslint-disable-next-line sonarjs/no-collapsible-if
  if (iteratedModels.includes(model)) { return; }

  iteratedModels.push(model);
  if (model.properties) {
    const existingProperties = model.properties;
    for (const [prop, propSchema] of Object.entries(existingProperties)) {
      model.properties[String(prop)] = trySplitModels(propSchema, iteratedModels);
    }
  }
  if (model.patternProperties) {
    const existingPatternProperties = model.patternProperties;
    for (const [pattern, patternModel] of Object.entries(existingPatternProperties)) {
      model.patternProperties[String(pattern)] = trySplitModels(patternModel, iteratedModels);
    }
  }
  if (model.additionalProperties) {
    model.additionalProperties = trySplitModels(model.additionalProperties, iteratedModels);
  }
  if (model.items) {
    let existingItems = model.items;
    if (Array.isArray(existingItems)) {
      for (const [itemIndex, itemModel] of existingItems.entries()) {
        existingItems[Number(itemIndex)] = trySplitModels(itemModel, iteratedModels);
      }
    } else {
      existingItems = trySplitModels(existingItems, iteratedModels);
    }
    model.items = existingItems;
  }
}
