
import { CommonModel, MetaModel, UnionModel, ObjectModel, DictionaryModel, StringModel, TupleModel, TupleValueModel, ArrayModel, BooleanModel, IntegerModel, FloatModel, EnumModel, EnumValueModel, ObjectPropertyModel, AnyModel} from '../models';

export function convertToMetaModel(jsonSchemaModel: CommonModel): MetaModel {
  const modelName = jsonSchemaModel.$id || 'undefined';

  const anyModel = convertToAnyModel(jsonSchemaModel, modelName);
  if (anyModel !== undefined) {
    return anyModel;
  }
  const unionModel = convertToUnionModel(jsonSchemaModel, modelName);
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
  const enumModel = convertToEnumModel(jsonSchemaModel, modelName);
  if (enumModel !== undefined) {
    return enumModel;
  }
  const booleanModel = convertToBooleanModel(jsonSchemaModel, modelName);
  if (booleanModel !== undefined) {
    return booleanModel;
  }
  const objectModel = convertToObjectModel(jsonSchemaModel, modelName);
  if (objectModel !== undefined) {
    return objectModel;
  }
  const tupleModel = convertToTupleModel(jsonSchemaModel, modelName);
  if (tupleModel !== undefined) {
    return tupleModel;
  }
  const arrayModel = convertToArrayModel(jsonSchemaModel, modelName);
  if (arrayModel !== undefined) {
    return arrayModel;
  }
  throw new Error('Failed to convert to MetaModel');
}
export function convertToUnionModel(jsonSchemaModel: CommonModel, name: string): UnionModel | undefined {
  if (!Array.isArray(jsonSchemaModel.type) || jsonSchemaModel.type.length <= 1) {
    return undefined;
  }
  // Has multiple types, so convert to union
  const unionModel = new UnionModel(name, jsonSchemaModel.originalInput, []);
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
  const enumModel = convertToEnumModel(jsonSchemaModel, name);
  if (enumModel !== undefined) {
    unionModel.union.push(enumModel);
  }
  const booleanModel = convertToBooleanModel(jsonSchemaModel, name);
  if (booleanModel !== undefined) {
    unionModel.union.push(booleanModel);
  }
  const objectModel = convertToObjectModel(jsonSchemaModel, name);
  if (objectModel !== undefined) {
    unionModel.union.push(objectModel);
  }
  const tupleModel = convertToTupleModel(jsonSchemaModel, name);
  if (tupleModel !== undefined) {
    unionModel.union.push(tupleModel);
  }
  const arrayModel = convertToArrayModel(jsonSchemaModel, name);
  if (arrayModel !== undefined) {
    unionModel.union.push(arrayModel);
  }
  return unionModel;
}
export function convertToStringModel(jsonSchemaModel: CommonModel, name: string): StringModel | undefined {
  if (!jsonSchemaModel.type?.includes('string')) {
    return undefined;
  }
  return new StringModel(name, jsonSchemaModel.originalInput);
}
export function convertToAnyModel(jsonSchemaModel: CommonModel, name: string): StringModel | undefined {
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
    const enumValueModel = new EnumValueModel(JSON.stringify(enumValue), enumValue);
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
export function convertToObjectModel(jsonSchemaModel: CommonModel, name: string): ObjectModel | undefined {
  if (!jsonSchemaModel.type?.includes('object')) {
    return undefined;
  }
  const metaModel = new ObjectModel(name, jsonSchemaModel.originalInput, {});
  for (const [propertyName, prop] of Object.entries(jsonSchemaModel.properties || {})) {
    const isRequired = jsonSchemaModel.isRequired(propertyName);
    const propertyModel = new ObjectPropertyModel(propertyName, isRequired, convertToMetaModel(prop));
    metaModel.properties[String(propertyName)] = propertyModel;
  }

  if (jsonSchemaModel.additionalProperties !== undefined) {
    const propertyName = 'additionalProperties';
    if (metaModel.properties[String(propertyName)] === undefined) {
      const keyModel = new StringModel(propertyName, jsonSchemaModel.additionalProperties.originalInput);
      const valueModel = convertToMetaModel(jsonSchemaModel.additionalProperties);
      const dictionaryModel = new DictionaryModel(propertyName, jsonSchemaModel.additionalProperties.originalInput, keyModel, valueModel, 'unwrap');
      const propertyModel = new ObjectPropertyModel(propertyName, false, dictionaryModel);
      metaModel.properties[String(propertyName)] = propertyModel;
    } else {
      throw new Error('Property already exists');
    }
  }

  if (jsonSchemaModel.patternProperties !== undefined) {
    for (const [pattern, patternModel] of Object.entries(jsonSchemaModel.patternProperties)) {
      const propertyName = `${pattern}_PatternProperty`;
      if (metaModel.properties[String(propertyName)] === undefined) {
        const keyModel = new StringModel(propertyName, pattern);
        const valueModel = convertToMetaModel(patternModel);
        const dictionaryModel = new DictionaryModel(propertyName, patternModel.originalInput, keyModel, valueModel, 'unwrap');
        const propertyModel = new ObjectPropertyModel(propertyName, false, dictionaryModel);
        metaModel.properties[String(propertyName)] = propertyModel;
      } else {
        throw new Error('Property already exists');
      }
    }
  }
  return metaModel;
}

export function convertToArrayModel(jsonSchemaModel: CommonModel, name: string): ArrayModel | undefined {
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
    const valueModel = convertToMetaModel(jsonSchemaModel.items as CommonModel);
    return new ArrayModel(name, jsonSchemaModel.originalInput, valueModel);
  }

  const valueModel = new UnionModel('union', jsonSchemaModel.originalInput, []);
  if (jsonSchemaModel.items !== undefined) {
    for (const itemModel of Array.isArray(jsonSchemaModel.items) ? jsonSchemaModel.items : [jsonSchemaModel.items]) {
      const itemsModel = convertToMetaModel(itemModel);
      valueModel.union.push(itemsModel);
    }
  }
  if (jsonSchemaModel.additionalItems !== undefined) {
    const itemsModel = convertToMetaModel(jsonSchemaModel.additionalItems);
    valueModel.union.push(itemsModel);
  }
  return new ArrayModel(name, jsonSchemaModel.originalInput, valueModel);
}
export function convertToTupleModel(jsonSchemaModel: CommonModel, name: string): TupleModel | undefined {
  const isTuple = jsonSchemaModel.type?.includes('array') && Array.isArray(jsonSchemaModel.items) && jsonSchemaModel.additionalItems === undefined;
  if (!isTuple) {
    return undefined;
  }

  const items = jsonSchemaModel.items as CommonModel[];
  //item multiple types + additionalItems not sat = tuple of item type
  const tupleModel = new TupleModel(name, jsonSchemaModel.originalInput, []);
  for (let i = 0; i < items.length; i++) {
    const item = items[Number(i)];
    const valueModel = convertToMetaModel(item);
    const tupleValueModel = new TupleValueModel(i, valueModel);
    tupleModel.tuple[Number(i)] = tupleValueModel;
  }
  return tupleModel;
}
