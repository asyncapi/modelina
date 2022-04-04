import { ConstrainedAnyModel, ConstrainedBooleanModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedMetaModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedTupleValueModel, ConstrainedArrayModel, ConstrainedUnionModel, ConstrainedEnumModel, ConstrainedDictionaryModel, ConstrainedEnumValueModel } from '../../models/ConstrainedMetaModel';
import { AnyModel, BooleanModel, FloatModel, IntegerModel, MetaModel, ObjectModel, ReferenceModel, StringModel, TupleModel, ArrayModel, UnionModel, EnumModel, DictionaryModel } from '../../models/MetaModel';
import { defaultPropertyKeyConstraints, PropertyKeyConstraintType } from './constrainer/PropertyKeyConstrainer';
import { defaultModelNameConstraints, ModelNameConstraintType } from './constrainer/ModelNameConstrainer';
import { defaultEnumKeyConstraints, EnumConstraintType } from './constrainer/EnumConstrainer';

export interface GoConstraints {
  enumKey: EnumConstraintType,
  modelName: ModelNameConstraintType,
  propertyKey: PropertyKeyConstraintType,
}

export const DefaultGoConstraints: GoConstraints = {
  enumKey: defaultEnumKeyConstraints(),
  modelName: defaultModelNameConstraints(),
  propertyKey: defaultPropertyKeyConstraints()
};

type TypeMappingFunction<T extends ConstrainedMetaModel> = (model: T) => string;

type TypeMapping = {
  Object?: TypeMappingFunction<ConstrainedObjectModel>,
  Reference?: TypeMappingFunction<ConstrainedReferenceModel>,
  Any?: TypeMappingFunction<ConstrainedAnyModel>,
  Float?: TypeMappingFunction<ConstrainedFloatModel>,
  Integer?: TypeMappingFunction<ConstrainedIntegerModel>,
  String?: TypeMappingFunction<ConstrainedStringModel>,
  Boolean?: TypeMappingFunction<ConstrainedBooleanModel>,
  Tuple?: TypeMappingFunction<ConstrainedTupleModel>,
  Array?: TypeMappingFunction<ConstrainedArrayModel>,
  Enum?: TypeMappingFunction<ConstrainedEnumModel>,
  Union?: TypeMappingFunction<ConstrainedUnionModel>,
  Dictionary?: TypeMappingFunction<ConstrainedDictionaryModel>
}

function constrainReferenceModel(constrainedName: string, metaModel: ReferenceModel, typeMapping: TypeMapping, constrainRules: GoConstraints): ConstrainedReferenceModel {
  const constrainedRefModel = constrainMetaModel(metaModel.ref, typeMapping, constrainRules);
  const constrainedModel = new ConstrainedReferenceModel(constrainedName, metaModel.originalInput, '', constrainedRefModel);
  if (typeMapping.Reference !== undefined) {
    constrainedModel.type = typeMapping.Reference(constrainedModel);
  } else {
    constrainedModel.type = constrainedModel.name;
  }
  return constrainedModel;
}
function constrainAnyModel(constrainedName: string, metaModel: AnyModel, typeMapping: TypeMapping): ConstrainedAnyModel {
  const constrainedModel = new ConstrainedAnyModel(constrainedName, metaModel.originalInput, '');
  if (typeMapping.Any !== undefined) {
    constrainedModel.type = typeMapping.Any(constrainedModel);
  } else {
    constrainedModel.type = 'interface{}';
  }
  return constrainedModel; 
}
function constrainFloatModel(constrainedName: string, metaModel: FloatModel, typeMapping: TypeMapping): ConstrainedFloatModel {
  const constrainedModel = new ConstrainedFloatModel(constrainedName, metaModel.originalInput, '');
  if (typeMapping.Float !== undefined) {
    constrainedModel.type = typeMapping.Float(constrainedModel);
  } else {
    constrainedModel.type = 'float64';
  }
  return constrainedModel;
}
function constrainIntegerModel(constrainedName: string, metaModel: IntegerModel, typeMapping: TypeMapping): ConstrainedIntegerModel {
  const constrainedModel = new ConstrainedIntegerModel(constrainedName, metaModel.originalInput, '');
  if (typeMapping.Integer !== undefined) {
    constrainedModel.type = typeMapping.Integer(constrainedModel);
  } else {
    constrainedModel.type = 'int';
  }
  return constrainedModel;
}
function constrainStringModel(constrainedName: string, metaModel: IntegerModel, typeMapping: TypeMapping): ConstrainedIntegerModel {
  const constrainedModel = new ConstrainedStringModel(constrainedName, metaModel.originalInput, '');
  if (typeMapping.String !== undefined) {
    constrainedModel.type = typeMapping.String(constrainedModel);
  } else {
    constrainedModel.type = 'string';
  }
  return constrainedModel;
}
function constrainBooleanModel(constrainedName: string, metaModel: BooleanModel, typeMapping: TypeMapping): ConstrainedBooleanModel {
  const constrainedModel = new ConstrainedBooleanModel(constrainedName, metaModel.originalInput, '');
  if (typeMapping.Boolean !== undefined) {
    constrainedModel.type = typeMapping.Boolean(constrainedModel);
  } else {
    constrainedModel.type = 'bool';
  }
  return constrainedModel;
}
function constrainTupleModel(constrainedName: string, metaModel: TupleModel, typeMapping: TypeMapping, constrainRules: GoConstraints): ConstrainedTupleModel {
  const constrainedTupleModels = metaModel.tuple.map((tupleValue) => {
    const tupleType = constrainMetaModel(tupleValue.value, typeMapping, constrainRules);
    return new ConstrainedTupleValueModel(tupleValue.index, tupleType);
  });
  const constrainedModel = new ConstrainedTupleModel(constrainedName, metaModel.originalInput, '', constrainedTupleModels);
  if (typeMapping.Tuple !== undefined) {
    constrainedModel.type = typeMapping.Tuple(constrainedModel);
  } else {
    const tupleType = '[]interface{}';
    constrainedModel.type = tupleType;
  }
  return constrainedModel;
}
function constrainArrayModel(constrainedName: string, metaModel: ArrayModel, typeMapping: TypeMapping, constrainRules: GoConstraints): ConstrainedArrayModel {
  const constrainedValueModel = constrainMetaModel(metaModel.valueModel, typeMapping, constrainRules);
  const constrainedModel = new ConstrainedArrayModel(constrainedName, metaModel.originalInput, '', constrainedValueModel);
  if (typeMapping.Array !== undefined) {
    constrainedModel.type = typeMapping.Array(constrainedModel);
  } else {
    constrainedModel.type = `[]${constrainedValueModel.type}`;
  }
  return constrainedModel;
}
function constrainUnionModel(constrainedName: string, metaModel: UnionModel, typeMapping: TypeMapping, constrainRules: GoConstraints): ConstrainedUnionModel {
  const constrainedUnionModels = metaModel.union.map((unionValue) => {
    return constrainMetaModel(unionValue, typeMapping, constrainRules);
  });
  const constrainedModel = new ConstrainedUnionModel(constrainedName, metaModel.originalInput, '', constrainedUnionModels);
  if (typeMapping.Union !== undefined) {
    constrainedModel.type = typeMapping.Union(constrainedModel);
  } else {
    constrainedModel.type = 'interface{}';
  }
  return constrainedModel;
}
function constrainDictionaryModel(constrainedName: string, metaModel: DictionaryModel, typeMapping: TypeMapping, constrainRules: GoConstraints): ConstrainedDictionaryModel {
  const keyModel = constrainMetaModel(metaModel.key, typeMapping, constrainRules);
  const valueModel = constrainMetaModel(metaModel.value, typeMapping, constrainRules);
  const constrainedModel = new ConstrainedDictionaryModel(constrainedName, metaModel.originalInput, '', keyModel, valueModel, metaModel.serializationType);
  if (typeMapping.Dictionary !== undefined) {
    constrainedModel.type = typeMapping.Dictionary(constrainedModel);
  } else {
    const type = `map[${keyModel.type}]${valueModel.type}`;
    constrainedModel.type = type;
  }
  return constrainedModel;
}

function constrainObjectModel(constrainedName: string, objectModel: ObjectModel, typeMapping: TypeMapping, constrainRules: GoConstraints): ConstrainedObjectModel {
  const constrainedObjectModel = new ConstrainedObjectModel(constrainedName, objectModel.originalInput, '', {});
  for (const [propertyKey, propertyMetaModel] of Object.entries(objectModel.properties)) {
    const constrainedPropertyName = constrainRules.propertyKey({propertyKey, constrainedObjectModel, objectModel});
    const constrainedProperty = constrainMetaModel(propertyMetaModel, typeMapping, constrainRules);
    constrainedObjectModel.properties[String(constrainedPropertyName)] = constrainedProperty;
  }
  if (typeMapping.Object !== undefined) {
    constrainedObjectModel.type = typeMapping.Object(constrainedObjectModel);
  } else {
    constrainedObjectModel.type = constrainedName;
  }
  return constrainedObjectModel;
}

export function ConstrainEnumModel(constrainedName: string, enumModel: EnumModel, typeMapping: TypeMapping, constrainRules: GoConstraints): ConstrainedEnumModel {
  const constrainedModel = new ConstrainedEnumModel(constrainedName, enumModel.originalInput, '', []);

  for (const enumValue of enumModel.values) {
    const constrainedEnumKey = constrainRules.enumKey({enumKey: String(enumValue.key), enumModel, constrainedEnumModel: constrainedModel});
    const constrainedEnumValueModel = new ConstrainedEnumValueModel(constrainedEnumKey, enumValue.value);
    constrainedModel.values.push(constrainedEnumValueModel);
  }
  if (typeMapping.Enum !== undefined) {
    constrainedModel.type = typeMapping.Enum(constrainedModel);
  } else {
    constrainedModel.type = constrainedName;
  }
  return constrainedModel;
}

export function constrainMetaModel(metaModel: MetaModel, typeMapping: TypeMapping, constrainRules: GoConstraints): ConstrainedMetaModel {
  const constrainedName = constrainRules.modelName({modelName: metaModel.name});
  
  if (metaModel instanceof ObjectModel) {
    return constrainObjectModel(constrainedName, metaModel, typeMapping, constrainRules);
  } else if (metaModel instanceof ReferenceModel) {
    return constrainReferenceModel(constrainedName, metaModel, typeMapping, constrainRules);
  } else if (metaModel instanceof AnyModel) {
    return constrainAnyModel(constrainedName, metaModel, typeMapping);
  } else if (metaModel instanceof FloatModel) {
    return constrainFloatModel(constrainedName, metaModel, typeMapping);
  } else if (metaModel instanceof IntegerModel) {
    return constrainIntegerModel(constrainedName, metaModel, typeMapping);
  } else if (metaModel instanceof StringModel) {
    return constrainStringModel(constrainedName, metaModel, typeMapping);
  } else if (metaModel instanceof BooleanModel) {
    return constrainBooleanModel(constrainedName, metaModel, typeMapping);
  } else if (metaModel instanceof TupleModel) {
    return constrainTupleModel(constrainedName, metaModel, typeMapping, constrainRules);
  } else if (metaModel instanceof ArrayModel) {
    return constrainArrayModel(constrainedName, metaModel, typeMapping, constrainRules);
  } else if (metaModel instanceof UnionModel) {
    return constrainUnionModel(constrainedName, metaModel, typeMapping, constrainRules);
  } else if (metaModel instanceof EnumModel) {
    return ConstrainEnumModel(constrainedName, metaModel, typeMapping, constrainRules);
  } else if (metaModel instanceof DictionaryModel) {
    return constrainDictionaryModel(constrainedName, metaModel, typeMapping, constrainRules);
  }
  throw new Error('Could not constrain model');
}
