import { Logger } from '../utils';
import {
  CommonModel,
  MetaModel,
  UnionModel,
  ObjectModel,
  DictionaryModel,
  StringModel,
  TupleModel,
  TupleValueModel,
  ArrayModel,
  BooleanModel,
  IntegerModel,
  FloatModel,
  EnumModel,
  EnumValueModel,
  ObjectPropertyModel,
  AnyModel,
  MetaModelOptions
} from '../models';

function getMetaModelOptions(commonModel: CommonModel): MetaModelOptions {
  const options: MetaModelOptions = {};

  if (commonModel.const) {
    options.const = {
      originalInput: commonModel.const
    };
  }

  if (Array.isArray(commonModel.type) && commonModel.type.includes('null')) {
    options.isNullable = true;
  } else {
    options.isNullable = false;
  }

  if (commonModel.discriminator) {
    options.discriminator = {
      discriminator: commonModel.discriminator
    };
  }

  if (commonModel.propertyIsRequired) {
    options.isRequired = true;
  }

  return options;
}

export function convertToMetaModel(
  jsonSchemaModel: CommonModel,
  alreadySeenModels: Map<CommonModel, MetaModel> = new Map()
): MetaModel {
  const hasModel = alreadySeenModels.has(jsonSchemaModel);
  if (hasModel) {
    return alreadySeenModels.get(jsonSchemaModel) as MetaModel;
  }
  const modelName = jsonSchemaModel.$id || 'undefined';

  const unionModel = convertToUnionModel(
    jsonSchemaModel,
    modelName,
    alreadySeenModels
  );
  if (unionModel !== undefined) {
    return unionModel;
  }
  const anyModel = convertToAnyModel(jsonSchemaModel, modelName);
  if (anyModel !== undefined) {
    return anyModel;
  }
  const enumModel = convertToEnumModel(jsonSchemaModel, modelName);
  if (enumModel !== undefined) {
    return enumModel;
  }
  const objectModel = convertToObjectModel(
    jsonSchemaModel,
    modelName,
    alreadySeenModels
  );
  if (objectModel !== undefined) {
    return objectModel;
  }
  const dictionaryModel = convertToDictionaryModel(
    jsonSchemaModel,
    modelName,
    alreadySeenModels
  );
  if (dictionaryModel !== undefined) {
    return dictionaryModel;
  }
  const tupleModel = convertToTupleModel(
    jsonSchemaModel,
    modelName,
    alreadySeenModels
  );
  if (tupleModel !== undefined) {
    return tupleModel;
  }
  const arrayModel = convertToArrayModel(
    jsonSchemaModel,
    modelName,
    alreadySeenModels
  );
  if (arrayModel !== undefined) {
    return arrayModel;
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
  return new AnyModel(
    modelName,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel)
  );
}
function isEnumModel(jsonSchemaModel: CommonModel): boolean {
  if (!Array.isArray(jsonSchemaModel.enum)) {
    return false;
  }
  return true;
}

function shouldBeAnyType(jsonSchemaModel: CommonModel): boolean {
  const containsAllTypesButNull =
    Array.isArray(jsonSchemaModel.type) &&
    jsonSchemaModel.type.length >= 6 &&
    !jsonSchemaModel.type.includes('null');
  const containsAllTypes =
    (Array.isArray(jsonSchemaModel.type) &&
      jsonSchemaModel.type.length === 7) ||
    containsAllTypesButNull;
  return containsAllTypesButNull || containsAllTypes;
}

/**
 * Converts a CommonModel into multiple models wrapped in a union model.
 *
 * Because a CommonModel might contain multiple models, it's name for each of those models would be the same, instead we slightly change the model name.
 * Each model has it's type as a name prepended to the union name.
 *
 * If the CommonModel has multiple types
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function convertToUnionModel(
  jsonSchemaModel: CommonModel,
  name: string,
  alreadySeenModels: Map<CommonModel, MetaModel>
): UnionModel | undefined {
  const containsUnions = Array.isArray(jsonSchemaModel.union);

  // Should not create union from two types where one is null
  const containsTypeWithNull =
    Array.isArray(jsonSchemaModel.type) &&
    jsonSchemaModel.type.length === 2 &&
    jsonSchemaModel.type.includes('null');
  const containsSimpleTypeUnion =
    Array.isArray(jsonSchemaModel.type) &&
    jsonSchemaModel.type.length > 1 &&
    !containsTypeWithNull;
  const isAnyType = shouldBeAnyType(jsonSchemaModel);

  //Lets see whether we should have a union or not.
  if (
    (!containsSimpleTypeUnion && !containsUnions) ||
    isEnumModel(jsonSchemaModel) ||
    isAnyType ||
    containsTypeWithNull
  ) {
    return undefined;
  }
  const unionModel = new UnionModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel),
    []
  );

  //cache model before continuing
  if (!alreadySeenModels.has(jsonSchemaModel)) {
    alreadySeenModels.set(jsonSchemaModel, unionModel);
  }

  // Has multiple types, so convert to union
  if (containsUnions && jsonSchemaModel.union) {
    for (const unionCommonModel of jsonSchemaModel.union) {
      const isSingleNullType =
        (Array.isArray(unionCommonModel.type) &&
          unionCommonModel.type.length === 1 &&
          unionCommonModel.type?.includes('null')) ||
        unionCommonModel.type === 'null';
      if (isSingleNullType) {
        unionModel.options.isNullable = true;
      } else {
        const unionMetaModel = convertToMetaModel(
          unionCommonModel,
          alreadySeenModels
        );
        unionModel.union.push(unionMetaModel);
      }
    }
    return unionModel;
  }

  // Has simple union types
  // Each must have a different name then the root union model, as it otherwise clashes when code is generated
  const enumModel = convertToEnumModel(jsonSchemaModel, `${name}_enum`);
  if (enumModel !== undefined) {
    unionModel.union.push(enumModel);
  }
  const objectModel = convertToObjectModel(
    jsonSchemaModel,
    `${name}_object`,
    alreadySeenModels
  );
  if (objectModel !== undefined) {
    unionModel.union.push(objectModel);
  }
  const dictionaryModel = convertToDictionaryModel(
    jsonSchemaModel,
    `${name}_dictionary`,
    alreadySeenModels
  );
  if (dictionaryModel !== undefined) {
    unionModel.union.push(dictionaryModel);
  }
  const tupleModel = convertToTupleModel(
    jsonSchemaModel,
    `${name}_tuple`,
    alreadySeenModels
  );
  if (tupleModel !== undefined) {
    unionModel.union.push(tupleModel);
  }
  const arrayModel = convertToArrayModel(
    jsonSchemaModel,
    `${name}_array`,
    alreadySeenModels
  );
  if (arrayModel !== undefined) {
    unionModel.union.push(arrayModel);
  }
  const stringModel = convertToStringModel(jsonSchemaModel, `${name}_string`);
  if (stringModel !== undefined) {
    unionModel.union.push(stringModel);
  }
  const floatModel = convertToFloatModel(jsonSchemaModel, `${name}_float`);
  if (floatModel !== undefined) {
    unionModel.union.push(floatModel);
  }
  const integerModel = convertToIntegerModel(
    jsonSchemaModel,
    `${name}_integer`
  );
  if (integerModel !== undefined) {
    unionModel.union.push(integerModel);
  }
  const booleanModel = convertToBooleanModel(
    jsonSchemaModel,
    `${name}_boolean`
  );
  if (booleanModel !== undefined) {
    unionModel.union.push(booleanModel);
  }
  return unionModel;
}
export function convertToStringModel(
  jsonSchemaModel: CommonModel,
  name: string
): StringModel | undefined {
  if (!jsonSchemaModel.type?.includes('string')) {
    return undefined;
  }
  return new StringModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel)
  );
}
export function convertToAnyModel(
  jsonSchemaModel: CommonModel,
  name: string
): AnyModel | undefined {
  const isAnyType = shouldBeAnyType(jsonSchemaModel);
  if (!Array.isArray(jsonSchemaModel.type) || !isAnyType) {
    return undefined;
  }
  return new AnyModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel)
  );
}
export function convertToIntegerModel(
  jsonSchemaModel: CommonModel,
  name: string
): IntegerModel | undefined {
  if (!jsonSchemaModel.type?.includes('integer')) {
    return undefined;
  }
  return new IntegerModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel)
  );
}
export function convertToFloatModel(
  jsonSchemaModel: CommonModel,
  name: string
): FloatModel | undefined {
  if (!jsonSchemaModel.type?.includes('number')) {
    return undefined;
  }
  return new FloatModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel)
  );
}
export function convertToEnumModel(
  jsonSchemaModel: CommonModel,
  name: string
): EnumModel | undefined {
  if (!isEnumModel(jsonSchemaModel)) {
    return undefined;
  }

  const enumValueToEnumValueModel = (enumValue: unknown): EnumValueModel => {
    if (typeof enumValue !== 'string') {
      return new EnumValueModel(JSON.stringify(enumValue), enumValue);
    }
    return new EnumValueModel(enumValue, enumValue);
  };

  const metaModel = new EnumModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel),
    []
  );

  if (jsonSchemaModel.enum) {
    for (const enumValue of jsonSchemaModel.enum) {
      metaModel.values.push(enumValueToEnumValueModel(enumValue));
    }
  }

  return metaModel;
}
export function convertToBooleanModel(
  jsonSchemaModel: CommonModel,
  name: string
): BooleanModel | undefined {
  if (!jsonSchemaModel.type?.includes('boolean')) {
    return undefined;
  }
  return new BooleanModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel)
  );
}

/**
 * Determine whether we have a dictionary or an object. because in some cases inputs might be:
 * { "type": "object", "additionalProperties": { "$ref": "#" } } which is to be interpreted as a dictionary not an object model.
 */
function isDictionary(jsonSchemaModel: CommonModel): boolean {
  if (
    Object.keys(jsonSchemaModel.properties || {}).length > 0 ||
    jsonSchemaModel.additionalProperties === undefined
  ) {
    return false;
  }
  return true;
}

/**
 * Return the original input based on additionalProperties and patternProperties.
 */
function getOriginalInputFromAdditionalAndPatterns(
  jsonSchemaModel: CommonModel
) {
  const originalInputs = [];
  if (jsonSchemaModel.additionalProperties !== undefined) {
    originalInputs.push(jsonSchemaModel.additionalProperties.originalInput);
  }

  if (jsonSchemaModel.patternProperties !== undefined) {
    for (const patternModel of Object.values(
      jsonSchemaModel.patternProperties
    )) {
      originalInputs.push(patternModel.originalInput);
    }
  }
  return originalInputs;
}

/**
 * Function creating the right meta model based on additionalProperties and patternProperties.
 */
function convertAdditionalAndPatterns(
  jsonSchemaModel: CommonModel,
  name: string,
  alreadySeenModels: Map<CommonModel, MetaModel>
) {
  const modelsAsValue = new Map<string, MetaModel>();
  if (jsonSchemaModel.additionalProperties !== undefined) {
    const additionalPropertyModel = convertToMetaModel(
      jsonSchemaModel.additionalProperties,
      alreadySeenModels
    );
    modelsAsValue.set(additionalPropertyModel.name, additionalPropertyModel);
  }

  if (jsonSchemaModel.patternProperties !== undefined) {
    for (const patternModel of Object.values(
      jsonSchemaModel.patternProperties
    )) {
      const patternPropertyModel = convertToMetaModel(patternModel);
      modelsAsValue.set(patternPropertyModel.name, patternPropertyModel);
    }
  }
  if (modelsAsValue.size === 1) {
    return Array.from(modelsAsValue.values())[0];
  }
  return new UnionModel(
    name,
    getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel),
    getMetaModelOptions(jsonSchemaModel),
    Array.from(modelsAsValue.values())
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export function convertToDictionaryModel(
  jsonSchemaModel: CommonModel,
  name: string,
  alreadySeenModels: Map<CommonModel, MetaModel>
): DictionaryModel | undefined {
  if (!isDictionary(jsonSchemaModel)) {
    return undefined;
  }
  const originalInput =
    getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel);
  const keyModel = new StringModel(
    name,
    originalInput,
    getMetaModelOptions(jsonSchemaModel)
  );
  const valueModel = convertAdditionalAndPatterns(
    jsonSchemaModel,
    name,
    alreadySeenModels
  );
  return new DictionaryModel(
    name,
    originalInput,
    getMetaModelOptions(jsonSchemaModel),
    keyModel,
    valueModel,
    'normal'
  );
}

export function convertToObjectModel(
  jsonSchemaModel: CommonModel,
  name: string,
  alreadySeenModels: Map<CommonModel, MetaModel>
): ObjectModel | undefined {
  if (
    !jsonSchemaModel.type?.includes('object') ||
    isDictionary(jsonSchemaModel)
  ) {
    return undefined;
  }

  const metaModel = new ObjectModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel),
    {}
  );
  //cache model before continuing
  if (!alreadySeenModels.has(jsonSchemaModel)) {
    alreadySeenModels.set(jsonSchemaModel, metaModel);
  }

  for (const [propertyName, prop] of Object.entries(
    jsonSchemaModel.properties || {}
  )) {
    const isRequired = jsonSchemaModel.isRequired(propertyName);

    const propertyModel = new ObjectPropertyModel(
      propertyName,
      isRequired,
      convertToMetaModel(prop, alreadySeenModels)
    );

    metaModel.properties[String(propertyName)] = propertyModel;
  }

  if (
    jsonSchemaModel.additionalProperties !== undefined ||
    jsonSchemaModel.patternProperties !== undefined
  ) {
    let propertyName = 'additionalProperties';
    while (metaModel.properties[String(propertyName)] !== undefined) {
      propertyName = `reserved_${propertyName}`;
    }
    const originalInput =
      getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel);
    const keyModel = new StringModel(
      propertyName,
      originalInput,
      getMetaModelOptions(jsonSchemaModel)
    );
    const valueModel = convertAdditionalAndPatterns(
      jsonSchemaModel,
      propertyName,
      alreadySeenModels
    );
    const dictionaryModel = new DictionaryModel(
      propertyName,
      originalInput,
      getMetaModelOptions(jsonSchemaModel),
      keyModel,
      valueModel,
      'unwrap'
    );
    const propertyModel = new ObjectPropertyModel(
      propertyName,
      false,
      dictionaryModel
    );
    metaModel.properties[String(propertyName)] = propertyModel;
  }
  return metaModel;
}

export function convertToArrayModel(
  jsonSchemaModel: CommonModel,
  name: string,
  alreadySeenModels: Map<CommonModel, MetaModel>
): ArrayModel | undefined {
  if (!jsonSchemaModel.type?.includes('array')) {
    return undefined;
  }

  const isNormalArray = !Array.isArray(jsonSchemaModel.items);
  //items single type = normal array
  //items not sat = normal array, any type
  if (isNormalArray) {
    const placeholderModel = new AnyModel(
      '',
      undefined,
      getMetaModelOptions(jsonSchemaModel)
    );
    const metaModel = new ArrayModel(
      name,
      jsonSchemaModel.originalInput,
      getMetaModelOptions(jsonSchemaModel),
      placeholderModel
    );
    alreadySeenModels.set(jsonSchemaModel, metaModel);
    if (jsonSchemaModel.items !== undefined) {
      const valueModel = convertToMetaModel(
        jsonSchemaModel.items as CommonModel,
        alreadySeenModels
      );
      metaModel.valueModel = valueModel;
    }
    return metaModel;
  }

  const valueModel = new UnionModel(
    'union',
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel),
    []
  );
  const metaModel = new ArrayModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel),
    valueModel
  );
  alreadySeenModels.set(jsonSchemaModel, metaModel);
  if (jsonSchemaModel.items !== undefined) {
    for (const itemModel of Array.isArray(jsonSchemaModel.items)
      ? jsonSchemaModel.items
      : [jsonSchemaModel.items]) {
      const itemsModel = convertToMetaModel(itemModel, alreadySeenModels);
      valueModel.union.push(itemsModel);
    }
  }
  if (jsonSchemaModel.additionalItems !== undefined) {
    const itemsModel = convertToMetaModel(
      jsonSchemaModel.additionalItems,
      alreadySeenModels
    );
    valueModel.union.push(itemsModel);
  }
  return metaModel;
}
export function convertToTupleModel(
  jsonSchemaModel: CommonModel,
  name: string,
  alreadySeenModels: Map<CommonModel, MetaModel>
): TupleModel | undefined {
  const isTuple =
    jsonSchemaModel.type?.includes('array') &&
    Array.isArray(jsonSchemaModel.items) &&
    jsonSchemaModel.additionalItems === undefined;
  if (!isTuple) {
    return undefined;
  }

  const items = jsonSchemaModel.items as CommonModel[];
  //item multiple types + additionalItems not sat = tuple of item type
  const tupleModel = new TupleModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel),
    []
  );
  alreadySeenModels.set(jsonSchemaModel, tupleModel);
  for (let i = 0; i < items.length; i++) {
    const item = items[Number(i)];
    const valueModel = convertToMetaModel(item, alreadySeenModels);
    const tupleValueModel = new TupleValueModel(i, valueModel);
    tupleModel.tuple[Number(i)] = tupleValueModel;
  }
  return tupleModel;
}
