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
import { JsonSchemaProcessorOptions } from '../processors';

function getMetaModelOptions(
  commonModel: CommonModel,
  processorOptions: JsonSchemaProcessorOptions
): MetaModelOptions {
  const options: MetaModelOptions = {};

  if (commonModel.const) {
    options.const = {
      originalInput: commonModel.const
    };
  } else if (
    processorOptions.interpretSingleEnumAsConst &&
    commonModel.enum?.length === 1
  ) {
    options.const = {
      originalInput: commonModel.enum[0]
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

  if (commonModel.format) {
    options.format = commonModel.format;
  }

  return options;
}

interface ConverterContext {
  name: string;
  jsonSchemaModel: CommonModel;
  options: JsonSchemaProcessorOptions;
  alreadySeenModels: Map<CommonModel, MetaModel>;
}

export function convertToMetaModel(context: {
  jsonSchemaModel: CommonModel;
  options: JsonSchemaProcessorOptions;
  alreadySeenModels: Map<CommonModel, MetaModel>;
}): MetaModel {
  const { jsonSchemaModel, alreadySeenModels = new Map(), options } = context;
  const hasModel = alreadySeenModels.has(jsonSchemaModel);
  if (hasModel) {
    return alreadySeenModels.get(jsonSchemaModel) as MetaModel;
  }
  const name = jsonSchemaModel.$id || 'undefined';

  const unionModel = convertToUnionModel({
    ...context,
    alreadySeenModels,
    name
  });
  if (unionModel !== undefined) {
    return unionModel;
  }
  const anyModel = convertToAnyModel({
    ...context,
    alreadySeenModels,
    name
  });
  if (anyModel !== undefined) {
    return anyModel;
  }
  const enumModel = convertToEnumModel({
    ...context,
    alreadySeenModels,
    name
  });
  if (enumModel !== undefined) {
    return enumModel;
  }
  const objectModel = convertToObjectModel({
    ...context,
    alreadySeenModels,
    name
  });
  if (objectModel !== undefined) {
    return objectModel;
  }
  const dictionaryModel = convertToDictionaryModel({
    ...context,
    alreadySeenModels,
    name
  });
  if (dictionaryModel !== undefined) {
    return dictionaryModel;
  }
  const tupleModel = convertToTupleModel({
    ...context,
    alreadySeenModels,
    name
  });
  if (tupleModel !== undefined) {
    return tupleModel;
  }
  const arrayModel = convertToArrayModel({
    ...context,
    alreadySeenModels,
    name
  });
  if (arrayModel !== undefined) {
    return arrayModel;
  }
  const stringModel = convertToStringModel({
    ...context,
    alreadySeenModels,
    name
  });
  if (stringModel !== undefined) {
    return stringModel;
  }
  const floatModel = convertToFloatModel({
    ...context,
    alreadySeenModels,
    name
  });
  if (floatModel !== undefined) {
    return floatModel;
  }
  const integerModel = convertToIntegerModel({
    ...context,
    alreadySeenModels,
    name
  });
  if (integerModel !== undefined) {
    return integerModel;
  }
  const booleanModel = convertToBooleanModel({
    ...context,
    alreadySeenModels,
    name
  });
  if (booleanModel !== undefined) {
    return booleanModel;
  }
  Logger.warn(
    `Failed to convert ${name} to MetaModel, defaulting to AnyModel`
  );
  return new AnyModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel, options)
  );
}
function isEnumModel(
  jsonSchemaModel: CommonModel,
  interpretSingleEnumAsConst: boolean = false
): boolean {
  if (
    !Array.isArray(jsonSchemaModel.enum) ||
    (jsonSchemaModel.enum.length <= 1 && interpretSingleEnumAsConst)
  ) {
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
  context: ConverterContext
): UnionModel | undefined {
  const { jsonSchemaModel, alreadySeenModels, options, name } = context;
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
    getMetaModelOptions(jsonSchemaModel, options),
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
        const unionMetaModel = convertToMetaModel({
          alreadySeenModels,
          jsonSchemaModel: unionCommonModel,
          options
        });
        unionModel.union.push(unionMetaModel);
      }
    }
    return unionModel;
  }

  // Has simple union types
  // Each must have a different name then the root union model, as it otherwise clashes when code is generated
  const enumModel = convertToEnumModel({
    ...context,
    alreadySeenModels,
    name: `${name}_enum`
  });
  if (enumModel !== undefined) {
    unionModel.union.push(enumModel);
  }
  const objectModel = convertToObjectModel({
    ...context,
    alreadySeenModels,
    name: `${name}_object`
  });
  if (objectModel !== undefined) {
    unionModel.union.push(objectModel);
  }
  const dictionaryModel = convertToDictionaryModel({
    ...context,
    alreadySeenModels,
    name: `${name}_dictionary`
  });
  if (dictionaryModel !== undefined) {
    unionModel.union.push(dictionaryModel);
  }
  const tupleModel = convertToTupleModel({
    ...context,
    alreadySeenModels,
    name: `${name}_tuple`
  });
  if (tupleModel !== undefined) {
    unionModel.union.push(tupleModel);
  }
  const arrayModel = convertToArrayModel({
    ...context,
    alreadySeenModels,
    name: `${name}_array`
  });
  if (arrayModel !== undefined) {
    unionModel.union.push(arrayModel);
  }
  const stringModel = convertToStringModel({
    ...context,
    name: `${name}_string`
  });
  if (stringModel !== undefined) {
    unionModel.union.push(stringModel);
  }
  const floatModel = convertToFloatModel({
    ...context,
    name: `${name}_float`
  });
  if (floatModel !== undefined) {
    unionModel.union.push(floatModel);
  }
  const integerModel = convertToIntegerModel({
    ...context,
    name: `${name}_integer`
  });
  if (integerModel !== undefined) {
    unionModel.union.push(integerModel);
  }
  const booleanModel = convertToBooleanModel({
    ...context,
    name: `${name}_boolean`
  });
  if (booleanModel !== undefined) {
    unionModel.union.push(booleanModel);
  }
  return unionModel;
}
export function convertToStringModel(
  context: ConverterContext
): StringModel | undefined {
  const { jsonSchemaModel, options, name } = context;
  if (!jsonSchemaModel.type?.includes('string')) {
    return undefined;
  }
  return new StringModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel, options)
  );
}
export function convertToAnyModel(
  context: ConverterContext
): AnyModel | undefined {
  const { jsonSchemaModel, options, name } = context;
  const isAnyType = shouldBeAnyType(jsonSchemaModel);
  if (!Array.isArray(jsonSchemaModel.type) || !isAnyType) {
    return undefined;
  }
  return new AnyModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel, options)
  );
}
export function convertToIntegerModel(
  context: ConverterContext
): IntegerModel | undefined {
  const { jsonSchemaModel, options, name } = context;
  if (!jsonSchemaModel.type?.includes('integer')) {
    return undefined;
  }
  return new IntegerModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel, options)
  );
}
export function convertToFloatModel(
  context: ConverterContext
): FloatModel | undefined {
  const { jsonSchemaModel, options, name } = context;
  if (!jsonSchemaModel.type?.includes('number')) {
    return undefined;
  }
  return new FloatModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel, options)
  );
}
export function convertToEnumModel(
  context: ConverterContext
): EnumModel | undefined {
  const { jsonSchemaModel, options, name } = context;
  if (!isEnumModel(jsonSchemaModel, options.interpretSingleEnumAsConst)) {
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
    getMetaModelOptions(jsonSchemaModel, options),
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
  context: ConverterContext
): BooleanModel | undefined {
  const { jsonSchemaModel, options, name } = context;
  if (!jsonSchemaModel.type?.includes('boolean')) {
    return undefined;
  }
  return new BooleanModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel, options)
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
function convertAdditionalAndPatterns(context: ConverterContext) {
  const { jsonSchemaModel, options, name } = context;
  const modelsAsValue = new Map<string, MetaModel>();
  if (jsonSchemaModel.additionalProperties !== undefined) {
    const additionalPropertyModel = convertToMetaModel({
      ...context,
      jsonSchemaModel: jsonSchemaModel.additionalProperties
    });
    modelsAsValue.set(additionalPropertyModel.name, additionalPropertyModel);
  }

  if (jsonSchemaModel.patternProperties !== undefined) {
    for (const patternModel of Object.values(
      jsonSchemaModel.patternProperties
    )) {
      const patternPropertyModel = convertToMetaModel({
        ...context,
        jsonSchemaModel: patternModel
      });
      modelsAsValue.set(patternPropertyModel.name, patternPropertyModel);
    }
  }
  if (modelsAsValue.size === 1) {
    return Array.from(modelsAsValue.values())[0];
  }
  return new UnionModel(
    name,
    getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel),
    getMetaModelOptions(jsonSchemaModel, options),
    Array.from(modelsAsValue.values())
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export function convertToDictionaryModel(
  context: ConverterContext
): DictionaryModel | undefined {
  const { jsonSchemaModel, options, name } = context;
  if (!isDictionary(jsonSchemaModel)) {
    return undefined;
  }
  const originalInput =
    getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel);
  const keyModel = new StringModel(name, originalInput, {});
  const valueModel = convertAdditionalAndPatterns(context);
  return new DictionaryModel(
    name,
    originalInput,
    getMetaModelOptions(jsonSchemaModel, options),
    keyModel,
    valueModel,
    'normal'
  );
}

export function convertToObjectModel(
  context: ConverterContext
): ObjectModel | undefined {
  const { jsonSchemaModel, alreadySeenModels, options, name } = context;
  if (
    !jsonSchemaModel.type?.includes('object') ||
    isDictionary(jsonSchemaModel)
  ) {
    return undefined;
  }

  const metaModel = new ObjectModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel, options),
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
      convertToMetaModel({ ...context, jsonSchemaModel: prop })
    );

    metaModel.properties[String(propertyName)] = propertyModel;
  }

  if (jsonSchemaModel.extend?.length) {
    metaModel.options.extend = [];

    for (const extend of jsonSchemaModel.extend) {
      metaModel.options.extend.push(
        convertToMetaModel({ ...context, jsonSchemaModel: extend })
      );
    }
  }

  if (
    jsonSchemaModel.additionalProperties !== undefined ||
    jsonSchemaModel.patternProperties !== undefined
  ) {
    let propertyName =
      options.propertyNameForAdditionalProperties ?? 'additionalProperties';
    while (metaModel.properties[String(propertyName)] !== undefined) {
      propertyName = `reserved_${propertyName}`;
    }
    const originalInput =
      getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel);
    const keyModel = new StringModel(
      propertyName,
      originalInput,
      getMetaModelOptions(jsonSchemaModel, options)
    );
    const valueModel = convertAdditionalAndPatterns({
      ...context,
      name: propertyName
    });
    const dictionaryModel = new DictionaryModel(
      propertyName,
      originalInput,
      getMetaModelOptions(jsonSchemaModel, options),
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
  context: ConverterContext
): ArrayModel | undefined {
  const { jsonSchemaModel, alreadySeenModels, options, name } = context;
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
      getMetaModelOptions(jsonSchemaModel, options)
    );
    const metaModel = new ArrayModel(
      name,
      jsonSchemaModel.originalInput,
      getMetaModelOptions(jsonSchemaModel, options),
      placeholderModel
    );
    alreadySeenModels.set(jsonSchemaModel, metaModel);
    if (jsonSchemaModel.items !== undefined) {
      const valueModel = convertToMetaModel({
        ...context,
        jsonSchemaModel: jsonSchemaModel.items as CommonModel
      });
      metaModel.valueModel = valueModel;
    }
    return metaModel;
  }

  const valueModel = new UnionModel(
    'union',
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel, options),
    []
  );
  const metaModel = new ArrayModel(
    name,
    jsonSchemaModel.originalInput,
    getMetaModelOptions(jsonSchemaModel, options),
    valueModel
  );
  alreadySeenModels.set(jsonSchemaModel, metaModel);
  if (jsonSchemaModel.items !== undefined) {
    for (const itemModel of Array.isArray(jsonSchemaModel.items)
      ? jsonSchemaModel.items
      : [jsonSchemaModel.items]) {
      const itemsModel = convertToMetaModel({
        ...context,
        jsonSchemaModel: itemModel
      });
      valueModel.union.push(itemsModel);
    }
  }
  if (jsonSchemaModel.additionalItems !== undefined) {
    const itemsModel = convertToMetaModel({
      ...context,
      jsonSchemaModel: jsonSchemaModel.additionalItems
    });
    valueModel.union.push(itemsModel);
  }
  return metaModel;
}
export function convertToTupleModel(
  context: ConverterContext
): TupleModel | undefined {
  const { jsonSchemaModel, alreadySeenModels, options, name } = context;
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
    getMetaModelOptions(jsonSchemaModel, options),
    []
  );
  alreadySeenModels.set(jsonSchemaModel, tupleModel);
  for (let i = 0; i < items.length; i++) {
    const item = items[Number(i)];
    const valueModel = convertToMetaModel({
      ...context,
      jsonSchemaModel: item
    });
    const tupleValueModel = new TupleValueModel(i, valueModel);
    tupleModel.tuple[Number(i)] = tupleValueModel;
  }
  return tupleModel;
}
