/* eslint-disable sonarjs/cognitive-complexity */

import {
  MetaModel,
  ReferenceModel,
  EnumModel,
  UnionModel,
  ArrayModel,
  TupleModel,
  StringModel,
  IntegerModel,
  FloatModel,
  BooleanModel,
  ObjectModel,
  DictionaryModel
} from '../models';

export type SplitOptions = {
  splitEnum?: boolean;
  splitUnion?: boolean;
  splitArray?: boolean;
  splitTuple?: boolean;
  splitString?: boolean;
  splitInteger?: boolean;
  splitFloat?: boolean;
  splitBoolean?: boolean;
  splitObject?: boolean;
  splitDictionary?: boolean;
};

/**
 * Try split the model
 * @param model
 * @param options
 * @param models
 * @returns whether the new or old MetaModel to use.
 */
const trySplitModel = (
  model: MetaModel,
  options: SplitOptions,
  models: MetaModel[]
): MetaModel => {
  const shouldSplit =
    (options.splitEnum === true && model instanceof EnumModel) ||
    (options.splitUnion === true && model instanceof UnionModel) ||
    (options.splitArray === true && model instanceof ArrayModel) ||
    (options.splitTuple === true && model instanceof TupleModel) ||
    (options.splitString === true && model instanceof StringModel) ||
    (options.splitInteger === true && model instanceof IntegerModel) ||
    (options.splitFloat === true && model instanceof FloatModel) ||
    (options.splitBoolean === true && model instanceof BooleanModel) ||
    (options.splitObject === true && model instanceof ObjectModel) ||
    (options.splitDictionary === true && model instanceof DictionaryModel);

  if (shouldSplit) {
    if (!models.includes(model)) {
      models.push(model);
    }
    return new ReferenceModel(
      model.name,
      model.originalInput,
      model.options,
      model
    );
  }
  return model;
};

/**
 * Overwrite the nested models with references where required.
 *
 * @param model
 * @param options
 * @param models
 * @returns an array of all the split models
 */
export const split = (
  model: MetaModel,
  options: SplitOptions,
  models: MetaModel[] = [model],
  alreadySeenModels: MetaModel[] = []
): MetaModel[] => {
  if (!alreadySeenModels.includes(model)) {
    alreadySeenModels.push(model);
  } else {
    return models;
  }
  if (model instanceof ObjectModel) {
    for (const [prop, propModel] of Object.entries(model.properties)) {
      const propertyModel = propModel.property;
      model.properties[String(prop)].property = trySplitModel(
        propModel.property,
        options,
        models
      );
      split(propertyModel, options, models, alreadySeenModels);
    }
  } else if (model instanceof UnionModel) {
    for (let index = 0; index < model.union.length; index++) {
      const unionModel = model.union[Number(index)];
      model.union[Number(index)] = trySplitModel(unionModel, options, models);
      split(unionModel, options, models, alreadySeenModels);
    }
  } else if (model instanceof ArrayModel) {
    const valueModel = model.valueModel;
    model.valueModel = trySplitModel(valueModel, options, models);
    split(valueModel, options, models, alreadySeenModels);
  } else if (model instanceof TupleModel) {
    for (const tuple of model.tuple) {
      const tupleModel = tuple.value;
      tuple.value = trySplitModel(tupleModel, options, models);
      split(tupleModel, options, models, alreadySeenModels);
    }
  } else if (model instanceof DictionaryModel) {
    const keyModel = model.key;
    const valueModel = model.value;
    model.key = trySplitModel(keyModel, options, models);
    model.value = trySplitModel(valueModel, options, models);
    split(keyModel, options, models, alreadySeenModels);
    split(valueModel, options, models, alreadySeenModels);
  }
  return models;
};
