import {
  AnyModel,
  ArrayModel,
  AvroSchema,
  BooleanModel,
  EnumModel,
  EnumValueModel,
  FloatModel,
  IntegerModel,
  MetaModel,
  MetaModelOptions,
  ObjectModel,
  ObjectPropertyModel,
  StringModel,
  UnionModel
} from '../models';
import { Logger } from '../utils';

function getMetaModelOptions(AvroModel: AvroSchema): MetaModelOptions {
  const options: MetaModelOptions = {};

  if (AvroModel.const) {
    options.const = {
      originalInput: AvroModel.const
    };
  }
  if (Array.isArray(AvroModel.type) && AvroModel.type.includes('null')) {
    options.isNullable = true;
  } else {
    options.isNullable = false;
  }
  if (AvroModel.discriminator) {
    options.discriminator = {
      discriminator: AvroModel.discriminator
    };
  }
  if (AvroModel.format) {
    options.format = AvroModel.format;
  }

  return options;
}

export function AvroToMetaModel(
  avroSchemaModel: AvroSchema,
  alreadySeenModels: Map<AvroSchema, MetaModel> = new Map()
): MetaModel {
  const hasModel = alreadySeenModels.has(avroSchemaModel);
  if (hasModel) {
    return alreadySeenModels.get(avroSchemaModel) as MetaModel;
  }

  const modelName = avroSchemaModel.name || 'undefined';

  const objectModel = toObjectModel(
    avroSchemaModel,
    modelName,
    alreadySeenModels
  );
  if (objectModel !== undefined) {
    return objectModel;
  }
  const arrayModel = toArrayModel(
    avroSchemaModel,
    modelName,
    alreadySeenModels
  );
  if (arrayModel !== undefined) {
    return arrayModel;
  }
  const booleanModel = toBooleanModel(avroSchemaModel, modelName);
  if (booleanModel !== undefined) {
    return booleanModel;
  }
  const stringModel = toStringModel(avroSchemaModel, modelName);
  if (stringModel !== undefined) {
    return stringModel;
  }
  const integerModel = toIntegerModel(avroSchemaModel, modelName);
  if (integerModel !== undefined) {
    return integerModel;
  }
  const floatModel = toFloatModel(avroSchemaModel, modelName);
  if (floatModel !== undefined) {
    return floatModel;
  }
  const enumModel = toEnumModel(avroSchemaModel, modelName);
  if (enumModel !== undefined) {
    return enumModel;
  }
  const unionModel = toUnionModel(
    avroSchemaModel,
    modelName,
    alreadySeenModels
  );
  if (unionModel !== undefined) {
    return unionModel;
  }

  Logger.warn('Failed to convert to MetaModel, defaulting to AnyModel.');
  return new AnyModel(
    modelName,
    avroSchemaModel.originalInput,
    getMetaModelOptions(avroSchemaModel)
  );
}

export function toBooleanModel(
  avroSchemaModel: AvroSchema,
  name: string
): BooleanModel | undefined {
  if (!avroSchemaModel.type?.includes('boolean')) {
    return undefined;
  }
  return new BooleanModel(
    name,
    avroSchemaModel.originalInput,
    getMetaModelOptions(avroSchemaModel)
  );
}
export function toIntegerModel(
  avroSchemaModel: AvroSchema,
  name: string
): IntegerModel | undefined {
  if (
    !avroSchemaModel.type?.includes('int') ||
    !avroSchemaModel.type?.includes('long')
  ) {
    return undefined;
  }
  return new IntegerModel(
    name,
    avroSchemaModel.originalInput,
    getMetaModelOptions(avroSchemaModel)
  );
}
export function toFloatModel(
  avroSchemaModel: AvroSchema,
  name: string
): FloatModel | undefined {
  if (
    !avroSchemaModel.type?.includes('float') ||
    !avroSchemaModel.type?.includes('double')
  ) {
    return undefined;
  }
  return new FloatModel(
    name,
    avroSchemaModel.originalInput,
    getMetaModelOptions(avroSchemaModel)
  );
}
export function toStringModel(
  avroSchemaModel: AvroSchema,
  name: string
): StringModel | undefined {
  if (
    !avroSchemaModel.type?.includes('string') ||
    !avroSchemaModel.type?.includes('bytes')
  ) {
    return undefined;
  }
  return new StringModel(
    name,
    avroSchemaModel.originalInput,
    getMetaModelOptions(avroSchemaModel)
  );
}
export function toEnumModel(
  avroSchemaModel: AvroSchema,
  name: string
): EnumModel | undefined {
  if (
    !avroSchemaModel.type?.includes('enum') ||
    !Array.isArray(avroSchemaModel.symbols)
  ) {
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
    avroSchemaModel.originalInput,
    getMetaModelOptions(avroSchemaModel),
    []
  );

  if (avroSchemaModel.symbols) {
    for (const enumValue of avroSchemaModel.symbols) {
      metaModel.values.push(enumValueToEnumValueModel(enumValue));
    }
  }
  return metaModel;
}
// checks if the typeof value can have any type
function shouldBeAnyType(avroSchemaModel: AvroSchema): boolean {
  // check the type array for the any type
  const containsAllTypesButNotNull =
    Array.isArray(avroSchemaModel.type) &&
    avroSchemaModel.type.length >= 6 &&
    !avroSchemaModel.type.includes('null');
  const containsAllTypes =
    (Array.isArray(avroSchemaModel.type) &&
      avroSchemaModel.type.length === 7) ||
    containsAllTypesButNotNull;
  return containsAllTypesButNotNull || containsAllTypes;
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
export function toUnionModel(
  avroSchemaModel: AvroSchema,
  name: string,
  alreadySeenModels: Map<AvroSchema, MetaModel>
): UnionModel | undefined {
  const containsUnions = Array.isArray(avroSchemaModel.type);

  // Should not create union from two types where one is null
  const containsTypeWithNull =
    Array.isArray(avroSchemaModel.type) &&
    avroSchemaModel.type.length === 2 &&
    avroSchemaModel.type.includes('null');
  const containsSimpleTypeUnion =
    Array.isArray(avroSchemaModel.type) &&
    avroSchemaModel.type.length > 1 &&
    !containsTypeWithNull;
  const isAnyType = shouldBeAnyType(avroSchemaModel);

  //Lets see whether we should have a union or not.
  if (
    (!containsSimpleTypeUnion && !containsUnions) ||
    Array.isArray(avroSchemaModel.type) ||
    isAnyType ||
    containsTypeWithNull
  ) {
    return undefined;
  }
  const unionModel = new UnionModel(
    name,
    avroSchemaModel.originalInput,
    getMetaModelOptions(avroSchemaModel),
    []
  );

  //cache model before continuing
  if (!alreadySeenModels.has(avroSchemaModel)) {
    alreadySeenModels.set(avroSchemaModel, unionModel);
  }

  // Has multiple types, so convert to union
  if (containsUnions && Array.isArray(avroSchemaModel.type)) {
    for (const unionCommonModel of avroSchemaModel.type) {
      const isSingleNullType =
        (Array.isArray(unionCommonModel.type) &&
          unionCommonModel.type.length === 1 &&
          unionCommonModel.type?.includes('null')) ||
        unionCommonModel.type === 'null';
      if (isSingleNullType) {
        unionModel.options.isNullable = true;
      } else {
        const unionMetaModel = AvroToMetaModel(
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
  const enumModel = toEnumModel(avroSchemaModel, `${name}_enum`);
  if (enumModel !== undefined) {
    unionModel.union.push(enumModel);
  }
  const objectModel = toObjectModel(
    avroSchemaModel,
    `${name}_object`,
    alreadySeenModels
  );
  if (objectModel !== undefined) {
    unionModel.union.push(objectModel);
  }
  // const dictionaryModel = toDictionaryModel(
  //   avroSchemaModel,
  //   `${name}_dictionary`,
  //   alreadySeenModels
  // );
  // if (dictionaryModel !== undefined) {
  //   unionModel.union.push(dictionaryModel);
  // }
  // const tupleModel = toTupleModel(
  //   avroSchemaModel,
  //   `${name}_tuple`,
  //   alreadySeenModels
  // );
  // if (tupleModel !== undefined) {
  //   unionModel.union.push(tupleModel);
  // }
  const arrayModel = toArrayModel(
    avroSchemaModel,
    `${name}_array`,
    alreadySeenModels
  );
  if (arrayModel !== undefined) {
    unionModel.union.push(arrayModel);
  }
  const stringModel = toStringModel(avroSchemaModel, `${name}_string`);
  if (stringModel !== undefined) {
    unionModel.union.push(stringModel);
  }
  const floatModel = toFloatModel(avroSchemaModel, `${name}_float`);
  if (floatModel !== undefined) {
    unionModel.union.push(floatModel);
  }
  const integerModel = toIntegerModel(avroSchemaModel, `${name}_integer`);
  if (integerModel !== undefined) {
    unionModel.union.push(integerModel);
  }
  const booleanModel = toBooleanModel(avroSchemaModel, `${name}_boolean`);
  if (booleanModel !== undefined) {
    unionModel.union.push(booleanModel);
  }
  return unionModel;
}
export function toObjectModel(
  avroSchemaModel: AvroSchema,
  name: string,
  alreadySeenModels: Map<AvroSchema, MetaModel>
): ObjectModel | undefined {
  if (!avroSchemaModel.type?.includes('record')) {
    return undefined;
  }
  const metaModel = new ObjectModel(
    name,
    avroSchemaModel.originalInput,
    getMetaModelOptions(avroSchemaModel),
    {}
  );
  // cache model before continuing
  if (!alreadySeenModels.has(avroSchemaModel)) {
    alreadySeenModels.set(avroSchemaModel, metaModel);
  }

  // fields: a required attribute of record and a JSON Array of JSON Objects
  for (const prop of avroSchemaModel?.fields || []) {
    const isRequired = avroSchemaModel.isRequired(prop.name);
    const propertyModel = new ObjectPropertyModel(
      prop.name ?? '',
      isRequired,
      AvroToMetaModel(prop, alreadySeenModels)
    );
    metaModel.properties[String(prop.name)] = propertyModel;
  }

  if (avroSchemaModel.extend?.length) {
    metaModel.options.extend = [];

    for (const extend of avroSchemaModel.extend) {
      metaModel.options.extend.push(AvroToMetaModel(extend, alreadySeenModels));
    }
  }

  return metaModel;
}
export function toArrayModel(
  avroSchemaModel: AvroSchema,
  name: string,
  alreadySeenModels: Map<AvroSchema, MetaModel>
): ArrayModel | undefined {
  if (!avroSchemaModel.type?.includes('array')) {
    return undefined;
  }
  const isNormalArray = !Array.isArray(avroSchemaModel.items);
  //items single type = normal array
  //items not sat = normal array, any type
  if (isNormalArray) {
    const placeholderModel = new AnyModel(
      '',
      undefined,
      getMetaModelOptions(avroSchemaModel)
    );
    const metaModel = new ArrayModel(
      name,
      avroSchemaModel.originalInput,
      getMetaModelOptions(avroSchemaModel),
      placeholderModel
    );
    alreadySeenModels.set(avroSchemaModel, metaModel);
    if (avroSchemaModel.items !== undefined) {
      const valueModel = AvroToMetaModel(
        avroSchemaModel.items as AvroSchema,
        alreadySeenModels
      );
      metaModel.valueModel = valueModel;
    }
    return metaModel;
  }

  const valueModel = new UnionModel(
    'union',
    avroSchemaModel.originalInput,
    getMetaModelOptions(avroSchemaModel),
    []
  );
  const metaModel = new ArrayModel(
    name,
    avroSchemaModel.originalInput,
    getMetaModelOptions(avroSchemaModel),
    valueModel
  );
  alreadySeenModels.set(avroSchemaModel, metaModel);
  if (avroSchemaModel.items !== undefined) {
    for (const itemModel of Array.isArray(avroSchemaModel.items)
      ? avroSchemaModel.items
      : [avroSchemaModel.items]) {
      const itemsModel = AvroToMetaModel(itemModel, alreadySeenModels);
      valueModel.union.push(itemsModel);
    }
  }

  return metaModel;
}
