import {
  AnyModel,
  ArrayModel,
  DictionaryModel,
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
  if (Array.isArray(AvroModel.type) && AvroModel.type?.includes('null')) {
    options.isNullable = true;
  } else {
    options.isNullable = false;
  }
  return options;
}

function shouldBeAnyType(avroSchemaModel: AvroSchema): boolean {
  // check the type array for the any type
  const containsAllTypesButNotNull =
    Array.isArray(avroSchemaModel.type) &&
    avroSchemaModel.type.length >= 8 &&
    !avroSchemaModel.type.includes('null');
  const containsAllTypes =
    Array.isArray(avroSchemaModel.type) && avroSchemaModel.type.length === 10;
  return containsAllTypesButNotNull || containsAllTypes;
}

export function AvroToMetaModel(
  avroSchemaModel: AvroSchema,
  alreadySeenModels: Map<AvroSchema, MetaModel> = new Map()
): MetaModel {
  const hasModel = alreadySeenModels.has(avroSchemaModel);
  if (hasModel) {
    return alreadySeenModels.get(avroSchemaModel) as MetaModel;
  }

  const modelName = avroSchemaModel?.name || 'undefined';

  if (shouldBeAnyType(avroSchemaModel)) {
    return new AnyModel(
      modelName,
      avroSchemaModel.originalInput,
      getMetaModelOptions(avroSchemaModel)
    );
  }
  if (
    avroSchemaModel.type &&
    !Array.isArray(avroSchemaModel.type) &&
    typeof avroSchemaModel.type !== 'string'
  ) {
    return AvroToMetaModel(
      avroSchemaModel.type as AvroSchema,
      alreadySeenModels
    );
  }
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
  const dictionaryModel = toDictionaryModel(
    avroSchemaModel, 
    modelName, 
    alreadySeenModels
  );
  if (dictionaryModel !== undefined) {
    return dictionaryModel;
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
  if (
    (typeof avroSchemaModel.type === 'string' ||
      Array.isArray(avroSchemaModel.type)) &&
    avroSchemaModel.type.includes('boolean')
  ) {
    return new BooleanModel(
      name,
      avroSchemaModel.originalInput,
      getMetaModelOptions(avroSchemaModel)
    );
  }
  return undefined;
}
export function toIntegerModel(
  avroSchemaModel: AvroSchema,
  name: string
): IntegerModel | undefined {
  if (
    (typeof avroSchemaModel.type === 'string' ||
      Array.isArray(avroSchemaModel.type)) &&
    (avroSchemaModel.type.includes('int') ||
      avroSchemaModel.type.includes('long'))
  ) {
    return new IntegerModel(
      name,
      avroSchemaModel.originalInput,
      getMetaModelOptions(avroSchemaModel)
    );
  }
  return undefined;
}
export function toFloatModel(
  avroSchemaModel: AvroSchema,
  name: string
): FloatModel | undefined {
  if (
    (typeof avroSchemaModel.type === 'string' ||
      Array.isArray(avroSchemaModel.type)) &&
    (avroSchemaModel.type.includes('float') ||
      avroSchemaModel.type.includes('double'))
  ) {
    return new FloatModel(
      name,
      avroSchemaModel.originalInput,
      getMetaModelOptions(avroSchemaModel)
    );
  }
  return undefined;
}
export function toStringModel(
  avroSchemaModel: AvroSchema,
  name: string
): StringModel | undefined {
  if (
    ((typeof avroSchemaModel.type === 'string' ||
      Array.isArray(avroSchemaModel.type)) &&
      avroSchemaModel.type.includes('string')) ||
    ((typeof avroSchemaModel.type === 'string' ||
      Array.isArray(avroSchemaModel.type)) &&
      avroSchemaModel.type.includes('fixed')) ||
    ((typeof avroSchemaModel.type === 'string' ||
      Array.isArray(avroSchemaModel.type)) &&
      avroSchemaModel.type.includes('bytes'))
  ) {
    return new StringModel(
      name,
      avroSchemaModel.originalInput,
      getMetaModelOptions(avroSchemaModel)
    );
  }
  return undefined;
}
export function toEnumModel(
  avroSchemaModel: AvroSchema,
  name: string
): EnumModel | undefined {
  if (
    ((typeof avroSchemaModel.type === 'string' ||
      Array.isArray(avroSchemaModel.type)) &&
      avroSchemaModel.type.includes('enum')) ||
    Array.isArray(avroSchemaModel.symbols)
  ) {
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
  return undefined;
}
export function toUnionModel(
  avroSchemaModel: AvroSchema,
  name: string,
  alreadySeenModels: Map<AvroSchema, MetaModel>
): UnionModel | undefined {
  if (!Array.isArray(avroSchemaModel.type)) {
    return undefined;
  }

  // Should not create union from two types where one is null, i.e, true for ['string', 'null']
  const containsTypeWithNull =
    Array.isArray(avroSchemaModel.type) &&
    avroSchemaModel.type.length === 2 &&
    avroSchemaModel.type.includes('null');

  if (containsTypeWithNull) {
    return undefined;
  }

  // type: ['string', 'int']
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
  if (
    (typeof avroSchemaModel.type === 'string' ||
      Array.isArray(avroSchemaModel.type)) &&
    avroSchemaModel.type.includes('record')
  ) {
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
      const propertyModel = new ObjectPropertyModel(
        prop.name ?? '',
        true,
        AvroToMetaModel(prop, alreadySeenModels)
      );
      metaModel.properties[String(prop.name)] = propertyModel;
    }
    return metaModel;
  }
  return undefined;
}
export function toArrayModel(
  avroSchemaModel: AvroSchema,
  name: string,
  alreadySeenModels: Map<AvroSchema, MetaModel>
): ArrayModel | undefined {
  if (
    (typeof avroSchemaModel.type === 'string' ||
      Array.isArray(avroSchemaModel.type)) &&
    avroSchemaModel.type?.includes('array')
  ) {
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
      const AvroModel = new AvroSchema();
      AvroModel.name = `${name}_${avroSchemaModel.items}`;
      AvroModel.type = avroSchemaModel.items;
      const valueModel = AvroToMetaModel(AvroModel, alreadySeenModels);
      metaModel.valueModel = valueModel;
    }
    return metaModel;
  }
  return undefined;
}
export function toDictionaryModel(
  avroSchemaModel: AvroSchema,
  name: string,
  alreadySeenModels: Map<AvroSchema, MetaModel>
): DictionaryModel | undefined {
  if (
    (typeof avroSchemaModel.type === 'string' ||
      Array.isArray(avroSchemaModel.type)) &&
    avroSchemaModel.type?.includes('map')
  ) {
    let keyModel = new StringModel(
      '',
      undefined,
      getMetaModelOptions(avroSchemaModel)
    );
    let valueModel = new AnyModel(
      '',
      undefined,
      getMetaModelOptions(avroSchemaModel)
    );
    if (avroSchemaModel.values !== undefined) {
      const AvroModel = new AvroSchema();
      AvroModel.name = `${name}_${avroSchemaModel.values}`;
      AvroModel.type = avroSchemaModel.values;
      valueModel = AvroToMetaModel(AvroModel, alreadySeenModels);
    }

    const metaModel = new DictionaryModel(
      name,
      avroSchemaModel.originalInput,
      getMetaModelOptions(avroSchemaModel),
      keyModel,
      valueModel
    );
    return metaModel;
  }
  return undefined;
}
