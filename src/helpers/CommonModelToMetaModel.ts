
import { Logger } from '../utils';
import { CommonModel, MetaModel, UnionModel, ObjectModel, DictionaryModel, StringModel, TupleModel, TupleValueModel, ArrayModel, BooleanModel, IntegerModel, FloatModel, EnumModel, EnumValueModel, ObjectPropertyModel, AnyModel} from '../models';

export function convertToMetaModel(jsonSchemaModel: CommonModel, alreadySeenModels: Map<CommonModel, MetaModel> = new Map()): MetaModel {
  const hasModel = alreadySeenModels.has(jsonSchemaModel);
  if (hasModel) {
    return alreadySeenModels.get(jsonSchemaModel) as MetaModel;
  }
  const modelName = jsonSchemaModel.$id || 'undefined';

  const anyModel = convertToAnyModel(jsonSchemaModel, modelName);
  if (anyModel !== undefined) {
    return anyModel;
  }
  const enumModel = convertToEnumModel(jsonSchemaModel, modelName);
  if (enumModel !== undefined) {
    return enumModel;
  }
  const objectModel = convertToObjectModel(jsonSchemaModel, modelName, alreadySeenModels);
  if (objectModel !== undefined) {
    return objectModel;
  }
  const tupleModel = convertToTupleModel(jsonSchemaModel, modelName, alreadySeenModels);
  if (tupleModel !== undefined) {
    return tupleModel;
  }
  const arrayModel = convertToArrayModel(jsonSchemaModel, modelName, alreadySeenModels);
  if (arrayModel !== undefined) {
    return arrayModel;
  }
  const unionModel = convertToUnionModel(jsonSchemaModel, modelName, alreadySeenModels);
  if (unionModel !== undefined) {
    return unionModel;
  }
  const stringModel = convertToStringModel(jsonSchemaModel, modelName);
  if (stringModel !== undefined) {
    return stringModel;
  }
  const floatModel = convertToFloatModel(jsonSchemaModel, modelName);
  if (floatModel !== undefined) {
    return floatModel;
  }
  const integerModel = convertToIntegerModel(jsonSchemaModel, modelName);
  if (integerModel !== undefined) {
    return integerModel;
  }
  const booleanModel = convertToBooleanModel(jsonSchemaModel, modelName);
  if (booleanModel !== undefined) {
    return booleanModel;
  }
  Logger.error('Failed to convert to MetaModel, defaulting to AnyModel');
  return new AnyModel(modelName, jsonSchemaModel.originalInput);
}
export function convertToUnionModel(jsonSchemaModel: CommonModel, name: string, alreadySeenModels: Map<CommonModel, MetaModel>): UnionModel | undefined {
  const unionModel = new UnionModel(name, jsonSchemaModel.originalInput, []);

  if (Array.isArray(jsonSchemaModel.union)) {
    alreadySeenModels.set(jsonSchemaModel, unionModel);
    for (const unionCommonModel of jsonSchemaModel.union) {
      const unionMetaModel = convertToMetaModel(unionCommonModel, alreadySeenModels);
      unionModel.union.push(unionMetaModel);
    }
    return unionModel;
  }

  if (!Array.isArray(jsonSchemaModel.type) || jsonSchemaModel.type.length <= 1) {
    return undefined;
  }
  // Has multiple types, so convert to union
  alreadySeenModels.set(jsonSchemaModel, unionModel);
  const enumModel = convertToEnumModel(jsonSchemaModel, name);
  if (enumModel !== undefined) {
    unionModel.union.push(enumModel);
  }
  const objectModel = convertToObjectModel(jsonSchemaModel, name, new Map());
  if (objectModel !== undefined) {
    unionModel.union.push(objectModel);
  }
  const tupleModel = convertToTupleModel(jsonSchemaModel, name, alreadySeenModels);
  if (tupleModel !== undefined) {
    unionModel.union.push(tupleModel);
  }
  const arrayModel = convertToArrayModel(jsonSchemaModel, name, alreadySeenModels);
  if (arrayModel !== undefined) {
    unionModel.union.push(arrayModel);
  }
  const stringModel = convertToStringModel(jsonSchemaModel, name);
  if (stringModel !== undefined) {
    unionModel.union.push(stringModel);
  }
  const floatModel = convertToFloatModel(jsonSchemaModel, name);
  if (floatModel !== undefined) {
    unionModel.union.push(floatModel);
  }
  const integerModel = convertToIntegerModel(jsonSchemaModel, name);
  if (integerModel !== undefined) {
    unionModel.union.push(integerModel);
  }
  const booleanModel = convertToBooleanModel(jsonSchemaModel, name);
  if (booleanModel !== undefined) {
    unionModel.union.push(booleanModel);
  }
  return unionModel;
}
export function convertToStringModel(jsonSchemaModel: CommonModel, name: string): StringModel | undefined {
  if (!jsonSchemaModel.type?.includes('string')) {
    return undefined;
  }
  return new StringModel(name, jsonSchemaModel.originalInput);
}
export function convertToAnyModel(jsonSchemaModel: CommonModel, name: string): AnyModel | undefined {
  if (!Array.isArray(jsonSchemaModel.type) || jsonSchemaModel.type.length !== 7) {
    return undefined;
  }
  return new AnyModel(name, jsonSchemaModel.originalInput);
}
export function convertToIntegerModel(jsonSchemaModel: CommonModel, name: string): IntegerModel | undefined {
  if (!jsonSchemaModel.type?.includes('integer')) {
    return undefined;
  }
  return new IntegerModel(name, jsonSchemaModel.originalInput);
}
export function convertToFloatModel(jsonSchemaModel: CommonModel, name: string): FloatModel | undefined {
  if (!jsonSchemaModel.type?.includes('number')) {
    return undefined;
  }
  return new FloatModel(name, jsonSchemaModel.originalInput);
}
export function convertToEnumModel(jsonSchemaModel: CommonModel, name: string): EnumModel | undefined {
  if (!Array.isArray(jsonSchemaModel.enum)) {
    return undefined;
  }
  const metaModel = new EnumModel(name, jsonSchemaModel.originalInput, []);
  for (const enumValue of jsonSchemaModel.enum) {
    let enumKey = enumValue;
    if (typeof enumValue !== 'string') {
      enumKey = JSON.stringify(enumValue);
    }
    const enumValueModel = new EnumValueModel(enumKey, enumValue);
    metaModel.values.push(enumValueModel);
  }
  return metaModel;
}
export function convertToBooleanModel(jsonSchemaModel: CommonModel, name: string): BooleanModel | undefined {
  if (!jsonSchemaModel.type?.includes('boolean')) {
    return undefined;
  }
  return new BooleanModel(name, jsonSchemaModel.originalInput);
}
export function convertToObjectModel(jsonSchemaModel: CommonModel, name: string, alreadySeenModels: Map<CommonModel, MetaModel>): ObjectModel | undefined {
  if (!jsonSchemaModel.type?.includes('object')) {
    return undefined;
  }
  const metaModel = new ObjectModel(name, jsonSchemaModel.originalInput, {});
  //cache model before continuing 
  alreadySeenModels.set(jsonSchemaModel, metaModel);

  for (const [propertyName, prop] of Object.entries(jsonSchemaModel.properties || {})) {
    const isRequired = jsonSchemaModel.isRequired(propertyName);
    const propertyModel = new ObjectPropertyModel(propertyName, isRequired, convertToMetaModel(prop, alreadySeenModels));
    metaModel.properties[String(propertyName)] = propertyModel;
  }

  if (jsonSchemaModel.additionalProperties !== undefined) {
    let propertyName = 'additionalProperties';
    while (metaModel.properties[String(propertyName)] !== undefined) {
      propertyName = `reserved_${propertyName}`;
    }
    const keyModel = new StringModel(propertyName, jsonSchemaModel.additionalProperties.originalInput);
    const valueModel = convertToMetaModel(jsonSchemaModel.additionalProperties, alreadySeenModels);
    const dictionaryModel = new DictionaryModel(propertyName, jsonSchemaModel.additionalProperties.originalInput, keyModel, valueModel, 'unwrap');
    const propertyModel = new ObjectPropertyModel(propertyName, false, dictionaryModel);
    metaModel.properties[String(propertyName)] = propertyModel;
  }
  return metaModel;
}

export function convertToArrayModel(jsonSchemaModel: CommonModel, name: string, alreadySeenModels: Map<CommonModel, MetaModel>): ArrayModel | undefined {
  if (!jsonSchemaModel.type?.includes('array')) {
    return undefined;
  }

  const isNormalArray = !Array.isArray(jsonSchemaModel.items) && jsonSchemaModel.additionalItems === undefined && jsonSchemaModel.items !== undefined;
  //item multiple types + additionalItems sat = both count, as normal array
  //item single type + additionalItems sat = contradicting, only items count, as normal array
  //item not sat + additionalItems sat = anything is allowed, as normal array
  //item single type + additionalItems not sat = normal array
  //item not sat + additionalItems not sat = normal array, any type
  if (isNormalArray) {
    const placeholderModel = new AnyModel('', undefined);
    const metaModel = new ArrayModel(name, jsonSchemaModel.originalInput, placeholderModel);
    alreadySeenModels.set(jsonSchemaModel, metaModel);

    const valueModel = convertToMetaModel(jsonSchemaModel.items as CommonModel, alreadySeenModels);
    metaModel.valueModel = valueModel;
    return metaModel;
  }

  const valueModel = new UnionModel('union', jsonSchemaModel.originalInput, []);
  const metaModel = new ArrayModel(name, jsonSchemaModel.originalInput, valueModel);
  alreadySeenModels.set(jsonSchemaModel, metaModel);
  if (jsonSchemaModel.items !== undefined) {
    for (const itemModel of Array.isArray(jsonSchemaModel.items) ? jsonSchemaModel.items : [jsonSchemaModel.items]) {
      const itemsModel = convertToMetaModel(itemModel, alreadySeenModels);
      valueModel.union.push(itemsModel);
    }
  }
  if (jsonSchemaModel.additionalItems !== undefined) {
    const itemsModel = convertToMetaModel(jsonSchemaModel.additionalItems, alreadySeenModels);
    valueModel.union.push(itemsModel);
  }
  return metaModel;
}
export function convertToTupleModel(jsonSchemaModel: CommonModel, name: string, alreadySeenModels: Map<CommonModel, MetaModel>): TupleModel | undefined {
  const isTuple = jsonSchemaModel.type?.includes('array') && Array.isArray(jsonSchemaModel.items) && jsonSchemaModel.additionalItems === undefined;
  if (!isTuple) {
    return undefined;
  }

  const items = jsonSchemaModel.items as CommonModel[];
  //item multiple types + additionalItems not sat = tuple of item type
  const tupleModel = new TupleModel(name, jsonSchemaModel.originalInput, []);
  alreadySeenModels.set(jsonSchemaModel, tupleModel);
  for (let i = 0; i < items.length; i++) {
    const item = items[Number(i)];
    const valueModel = convertToMetaModel(item, alreadySeenModels);
    const tupleValueModel = new TupleValueModel(i, valueModel);
    tupleModel.tuple[Number(i)] = tupleValueModel;
  }
  return tupleModel;
}
