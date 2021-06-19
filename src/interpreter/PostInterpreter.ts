import { CommonModel } from '../models';
import { Logger } from '../utils';
import { isEnum, isModelObject } from './Utils';
/**
 * Post process the interpreted model. By applying the following:
 * - Ensure models are split as required
 * 
 * @param model 
 */
export function postInterpretModel(model: CommonModel): CommonModel[] {
  const splitModels: CommonModel[] = [model];
  ensureModelsAreSplit(model, splitModels);
  return splitModels;
}

/**
 * This function splits up a model if needed and add the new model to the list of models.
 * 
 * @param model check if it should be split up
 * @param iteratedModels which have already been split up
 */
function trySplitModels(model: CommonModel, splitModels: CommonModel[], iteratedModels: CommonModel[]): CommonModel {
  let modelToReturn: CommonModel = model;
  if (isModelObject(model) === true || isEnum(model) === true) {
    Logger.info(`Splitting model ${model.$id || 'any'} since it should be on its own`);
    const switchRootModel = new CommonModel();
    switchRootModel.$ref = model.$id;
    modelToReturn = switchRootModel;
    if (!splitModels.includes(model)) {
      splitModels.push(model);
    }
  }
  ensureModelsAreSplit(model, splitModels, iteratedModels);
  return modelToReturn;
}

/**
 * Split up all models which should and use ref instead.
 * 
 * @param model to ensure are split
 * @param iteratedModels which are already split
 */
function ensureModelsAreSplit(model: CommonModel, splitModels: CommonModel[], iteratedModels: CommonModel[] = []): void {
  // eslint-disable-next-line sonarjs/no-collapsible-if
  if (iteratedModels.includes(model)) { return; }
  iteratedModels.push(model);
  if (model.properties) {
    const existingProperties = model.properties;
    for (const [prop, propSchema] of Object.entries(existingProperties)) {
      model.properties[String(prop)] = trySplitModels(propSchema, splitModels, iteratedModels);
    }
  }
  if (model.patternProperties) {
    const existingPatternProperties = model.patternProperties;
    for (const [pattern, patternModel] of Object.entries(existingPatternProperties)) {
      model.patternProperties[String(pattern)] = trySplitModels(patternModel, splitModels, iteratedModels);
    }
  }
  if (model.additionalProperties) {
    model.additionalProperties = trySplitModels(model.additionalProperties, splitModels, iteratedModels);
  }
  if (model.items) {
    let existingItems = model.items;
    if (Array.isArray(existingItems)) {
      for (const [itemIndex, itemModel] of existingItems.entries()) {
        existingItems[Number(itemIndex)] = trySplitModels(itemModel, splitModels, iteratedModels);
      }
    } else {
      existingItems = trySplitModels(existingItems, splitModels, iteratedModels);
    }
    model.items = existingItems;
  }
}
