import { CommonModel } from '../models';
import { Logger } from '../utils';
import { isModelObject } from './Utils';

export function postProcessModel(model: CommonModel): CommonModel[] {
  const iteratedModels: CommonModel[] = [];
  ensureModelsAreSplit(model, iteratedModels);
  return iteratedModels;
}

/**
 * This function splits up a model if needed and add the new model to the list of models.
 * 
 * @param model check if it should be split up
 * @param models which have already been split up
 */
function splitModels(model: CommonModel, iteratedModels: CommonModel[]): CommonModel {
  if (isModelObject(model)) {
    Logger.info(`Splitting model ${model.$id || 'any'} since it should be on its own`);
    const switchRootModel = new CommonModel();
    switchRootModel.$ref = model.$id;
    iteratedModels.push(model);
    return switchRootModel;
  }
  return model;
}

/**
 * Split up all models which should and use ref instead.
 * 
 * @param model to ensure are split
 * @param models which are already split
 */
function ensureModelsAreSplit(model: CommonModel, iteratedModels: CommonModel[] = []): void {
  // eslint-disable-next-line sonarjs/no-collapsible-if
  if (model.properties) {
    const existingProperties = model.properties;
    for (const [prop, propSchema] of Object.entries(existingProperties)) {
      model.properties[String(prop)] = splitModels(propSchema, iteratedModels);
    }
  }
  iteratedModels.push(model);
}
