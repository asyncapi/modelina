import { ConstrainedAnyModel, ConstrainedBooleanModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedMetaModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedTupleValueModel, ConstrainedArrayModel, ConstrainedUnionModel, ConstrainedEnumModel, ConstrainedDictionaryModel, ConstrainedEnumValueModel } from '../../models/ConstrainedMetaModel';
import { AnyModel, BooleanModel, FloatModel, IntegerModel, MetaModel, ObjectModel, ReferenceModel, StringModel, TupleModel, ArrayModel, UnionModel, EnumModel, DictionaryModel } from '../../models/MetaModel';
import { defaultPropertyKeyConstraints, PropertyKeyConstraintType } from './constrainer/PropertyKeyConstrainer';
import { defaultModelNameConstraints, ModelNameConstraintType } from './constrainer/ModelNameConstrainer';
import { defaultEnumKeyConstraints, EnumConstraintType } from './constrainer/EnumConstrainer';
import { Logger } from '../../utils';

export interface JavaScriptConstraints {
  enumKey: EnumConstraintType,
  modelName: ModelNameConstraintType,
  propertyKey: PropertyKeyConstraintType,
}

export const DefaultTypeScriptConstraints: TypeScriptConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};

function constrainTupleModel(constrainedName: string, metaModel: TupleModel, constrainRules: TypeScriptConstraints): ConstrainedTupleModel {
  const constrainedTupleModels = metaModel.tuple.map((tupleValue) => {
    const tupleType = constrainMetaModel(tupleValue.value, constrainRules);
    return new ConstrainedTupleValueModel(tupleValue.index, tupleType);
  });
  return new ConstrainedTupleModel(constrainedName, metaModel.originalInput, '', constrainedTupleModels);
}
function constrainArrayModel(constrainedName: string, metaModel: ArrayModel, constrainRules: TypeScriptConstraints): ConstrainedArrayModel {
  const constrainedValueModel = constrainMetaModel(metaModel.valueModel, constrainRules);
  return new ConstrainedArrayModel(constrainedName, metaModel.originalInput, '', constrainedValueModel);
}
function constrainUnionModel(constrainedName: string, metaModel: UnionModel, constrainRules: TypeScriptConstraints): ConstrainedUnionModel {
  const constrainedUnionModels = metaModel.union.map((unionValue) => {
    return constrainMetaModel(unionValue, constrainRules);
  });
  return new ConstrainedUnionModel(constrainedName, metaModel.originalInput, '', constrainedUnionModels);
}
function constrainDictionaryModel(constrainedName: string, metaModel: DictionaryModel, constrainRules: TypeScriptConstraints): ConstrainedDictionaryModel {
  let keyModel;    
  //There is some restrictions on what can be used as keys for dictionaries.
  if (metaModel.key instanceof UnionModel) {
    Logger.error('Key for dictionary is not allowed to be union type, falling back to any model.');
    const anyModel = new AnyModel(metaModel.key.name, metaModel.key.originalInput);
    keyModel = constrainMetaModel(anyModel, constrainRules);
  } else {
    keyModel = constrainMetaModel(metaModel.key, constrainRules);
  }
  const valueModel = constrainMetaModel(metaModel.value, constrainRules);
  return new ConstrainedDictionaryModel(constrainedName, metaModel.originalInput, '', keyModel, valueModel, metaModel.serializationType);
}

function constrainObjectModel(constrainedName: string, objectModel: ObjectModel, constrainRules: TypeScriptConstraints): ConstrainedObjectModel {
  const constrainedObjectModel = new ConstrainedObjectModel(constrainedName, objectModel.originalInput, '', {});
  for (const [propertyKey, propertyMetaModel] of Object.entries(objectModel.properties)) {
    const constrainedPropertyName = constrainRules.propertyKey({propertyKey, constrainedObjectModel, objectModel});
    const constrainedProperty = constrainMetaModel(propertyMetaModel, constrainRules);
    constrainedObjectModel.properties[String(constrainedPropertyName)] = constrainedProperty;
  }
  return constrainedObjectModel;
}

export function ConstrainEnumModel(constrainedName: string, enumModel: EnumModel, constrainRules: TypeScriptConstraints): ConstrainedEnumModel {
  const constrainedModel = new ConstrainedEnumModel(constrainedName, enumModel.originalInput, '', []);

  for (const enumValue of enumModel.values) {
    const constrainedEnumKey = constrainRules.enumKey({enumKey: String(enumValue.key), enumModel, constrainedEnumModel: constrainedModel});
    let normalizedEnumValue;
    switch (typeof enumValue.value) {
    case 'string':
    case 'boolean':
      normalizedEnumValue = `"${enumValue.value}"`;
      break;
    case 'bigint':
    case 'number': {
      normalizedEnumValue = enumValue.value;
      break;
    }
    case 'object': {
      normalizedEnumValue = `'${JSON.stringify(enumValue.value)}'`;
      break;
    }
    default: {
      normalizedEnumValue = String(enumValue.value);
    }
    }
    const constrainedEnumValueModel = new ConstrainedEnumValueModel(constrainedEnumKey, normalizedEnumValue);
    constrainedModel.values.push(constrainedEnumValueModel);
  }
  return constrainedModel;
}

export function constrainMetaModel(metaModel: MetaModel, constrainRules: TypeScriptConstraints): ConstrainedMetaModel {
  const constrainedName = constrainRules.modelName({modelName: metaModel.name});
  
  if (metaModel instanceof ObjectModel) {
    return constrainObjectModel(constrainedName, metaModel, constrainRules);
  } else if (metaModel instanceof ReferenceModel) {
    const constrainedRefModel = constrainMetaModel(metaModel.ref, constrainRules);
    return new ConstrainedReferenceModel(constrainedName, metaModel.originalInput, '', constrainedRefModel);
  } else if (metaModel instanceof AnyModel) {
    return new ConstrainedAnyModel(constrainedName, metaModel.originalInput, '');
  } else if (metaModel instanceof FloatModel) {
    return new ConstrainedFloatModel(constrainedName, metaModel.originalInput, '');
  } else if (metaModel instanceof IntegerModel) {
    return new ConstrainedIntegerModel(constrainedName, metaModel.originalInput, '');
  } else if (metaModel instanceof StringModel) {
    return new ConstrainedStringModel(constrainedName, metaModel.originalInput, '');
  } else if (metaModel instanceof BooleanModel) {
    return new ConstrainedBooleanModel(constrainedName, metaModel.originalInput, '');
  } else if (metaModel instanceof TupleModel) {
    return constrainTupleModel(constrainedName, metaModel, constrainRules);
  } else if (metaModel instanceof ArrayModel) {
    return constrainArrayModel(constrainedName, metaModel, constrainRules);
  } else if (metaModel instanceof UnionModel) {
    return constrainUnionModel(constrainedName, metaModel, constrainRules);
  } else if (metaModel instanceof EnumModel) {
    return ConstrainEnumModel(constrainedName, metaModel, constrainRules);
  } else if (metaModel instanceof DictionaryModel) {
    return constrainDictionaryModel(constrainedName, metaModel, constrainRules);
  }
  throw new Error('Could not constrain model');
}
