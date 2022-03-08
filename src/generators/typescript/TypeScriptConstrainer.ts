import { FormatHelpers } from 'helpers';
import { ConstrainedAnyModel, ConstrainedBooleanModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedMetaModel, ConstrainedObjectModel, ConstrainedReferencedModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedTupleValueModel, ConstrainedArrayModel, ConstrainedUnionModel, ConstrainedEnumModel } from '../../models/ConstrainedMetaModel';
import { AnyModel, BooleanModel, FloatModel, IntegerModel, MetaModel, ObjectModel, ReferencedModel, StringModel, TupleModel, ArrayModel, UnionModel, EnumModel } from '../../models/MetaModel';
import { DefaultPropertyKeyConstraints, ModelPropertyKeyConstraints } from './constrainer/ModelPropertyKeyConstrainer';
import { DefaultModelNameConstraints, ModelNameConstraints } from './constrainer/ModelNameConstrainer';
export interface TypeScriptConstraints {
  modelNameConstraints: ModelNameConstraints,
  modelPropertyKeyConstraints: ModelPropertyKeyConstraints,
}

export const DefaultTypeScriptConstraints: TypeScriptConstraints = {
  modelNameConstraints: DefaultModelNameConstraints,
  modelPropertyKeyConstraints: DefaultPropertyKeyConstraints
}
export function ConstrainModelName(value: string, constrainRules: TypeScriptConstraints): string {
  let constrainedValue = value;
  constrainedValue = constrainRules.modelNameConstraints.NO_SPECIAL_CHAR(constrainedValue);
  constrainedValue = constrainRules.modelNameConstraints.NO_NUMBER_START_CHAR(constrainedValue);
  constrainedValue = constrainRules.modelNameConstraints.NO_EMPTY_VALUE(constrainedValue);
  constrainedValue = constrainRules.modelNameConstraints.NAMING_FORMATTER(constrainedValue);
  constrainedValue = constrainRules.modelNameConstraints.NO_RESERVED_KEYWORDS(constrainedValue);
  return constrainedValue;
}
export function ConstrainPropertyKey(value: string, constrainRules: TypeScriptConstraints): string {
  let constrainedValue = value;
  constrainedValue = constrainRules.modelPropertyKeyConstraints.NO_SPECIAL_CHAR(constrainedValue);
  constrainedValue = constrainRules.modelPropertyKeyConstraints.NO_NUMBER_START_CHAR(constrainedValue);
  constrainedValue = constrainRules.modelPropertyKeyConstraints.NO_EMPTY_VALUE(constrainedValue);
  constrainedValue = constrainRules.modelPropertyKeyConstraints.NAMING_FORMATTER(constrainedValue);
  constrainedValue = constrainRules.modelPropertyKeyConstraints.NO_RESERVED_KEYWORDS(constrainedValue);
  return constrainedValue;
}

export function TypeScriptConstrainer(metaModel: MetaModel, constrainRules: TypeScriptConstraints): ConstrainedMetaModel {
  const constrainedName = ConstrainModelName(metaModel.name, constrainRules);
  
  if (metaModel instanceof ObjectModel) {
    return constrainObjectModel(metaModel, constrainRules);
  } else if (metaModel instanceof ReferencedModel) {
    const type = '';
    return new ConstrainedReferencedModel(constrainedName, type);
  } else if (metaModel instanceof AnyModel) {
    const type = 'any';
    return new ConstrainedAnyModel(constrainedName, type);
  } else if (metaModel instanceof FloatModel) {
    const type = 'number';
    return new ConstrainedFloatModel(constrainedName, type);
  } else if (metaModel instanceof IntegerModel) {
    const type = 'integer';
    return new ConstrainedIntegerModel(constrainedName, type);
  } else if (metaModel instanceof StringModel) {
    const type = 'string';
    return new ConstrainedStringModel(constrainedName, type);
  } else if (metaModel instanceof BooleanModel) {
    const type = 'boolean';
    return new ConstrainedBooleanModel(constrainedName, type);
  } else if (metaModel instanceof TupleModel) {
    const constrainedTupleModels = metaModel.tupleModels.map((tupleValue) => {
      const tupleType = TypeScriptConstrainer(tupleValue.value, constrainRules);
      return new ConstrainedTupleValueModel(tupleValue.index, tupleType);
    });
    const tupleTypes = constrainedTupleModels.map((constrainedType) => {
      return constrainedType.value.type;
    });
    const tupleType = `[${tupleTypes.join(', ')}]`;
    const model = new ConstrainedTupleModel(constrainedName, tupleType);
    model.tupleModels = constrainedTupleModels;
    return model;
  } else if (metaModel instanceof ArrayModel) {
    const constrainedValueModel = TypeScriptConstrainer(metaModel.valueModel, constrainRules);
    const type = `${constrainedValueModel.type}[]`;
    return new ConstrainedArrayModel(constrainedName, type, constrainedValueModel);
  } else if (metaModel instanceof UnionModel) {
    const constrainedUnionModels = metaModel.unionModels.map((unionValue) => {
      return TypeScriptConstrainer(unionValue, constrainRules);
    });
    const type = constrainedUnionModels.join(' | ');
    const model = new ConstrainedUnionModel(constrainedName, type);
    model.originalInput = metaModel.originalInput;
    model.unionModels = constrainedUnionModels;
    return model;
  } else if (metaModel instanceof EnumModel) {
    
  } else if (metaModel instanceof DictionaryModel) {

  }
}

export function constrainObjectModel(objectModel: ObjectModel, constrainRules: TypeScriptConstraints): ConstrainedObjectModel {
  const constrainedObjectName = ConstrainName(objectModel.name, constrainRules);

  const constrainedObjectModel = new ConstrainedObjectModel(constrainedObjectName, constrainedObjectName);
  constrainedObjectModel.properties = {};
  for (const [propertyName, propertyMetaModel] of Object.entries(objectModel.properties)) {
    let constrainedPropertyName = propertyName;
    constrainedPropertyName = constrainRules.properties.NO_SPECIAL_CHAR(constrainedPropertyName);
    constrainedPropertyName = constrainRules.properties.NO_NUMBER_START_CHAR(constrainedPropertyName);
    constrainedPropertyName = constrainRules.properties.NO_EMPTY_VALUE(constrainedPropertyName);
    constrainedPropertyName = constrainRules.properties.NAMING_FORMATTER(constrainedPropertyName);
    constrainedPropertyName = constrainRules.properties.NO_DUPLICATE_PROPERTIES(constrainedObjectModel, objectModel, constrainedPropertyName, constrainRules.properties.NAMING_FORMATTER);

    const constrainedProperty = TypeScriptConstrainer(propertyMetaModel, constrainRules);
    constrainedObjectModel.properties[String(propertyName)] = constrainedProperty;
  }
  return constrainedObjectModel;
}

export function constrainEnumModel(enumModel: EnumModel, constrainRules: TypeScriptConstraints): ConstrainedEnumModel {
  for (const enumValueModel of enumModel.values) {
    //Enum keys can be any JS type

    //Enum values can be any JS type
  }
}
export function constrainEnumKey() {
  let key;
  switch (typeof value) {
  case 'bigint':
  case 'number': {
    key = `number_${value}`;
    break;
  }
  case 'object': {
    key = JSON.stringify(value);
    break;
  }
  default: {
    //Ensure no special char can be the beginning letter 
    if (!(/^[a-zA-Z]+$/).test(key.charAt(0))) {
      key = `String_${key}`;
    }
  }
  }

  return FormatHelpers.toConstantCase(key);
}

export function constrainEnumValue(rawEnumValue: any) {
  let normalizedValue;
  switch (typeof value) {
  case 'string':
  case 'boolean':
    normalizedValue = `"${value}"`;
    break;
  case 'bigint':
  case 'number': {
    normalizedValue = value;
    break;
  }
  case 'object': {
    normalizedValue = `'${JSON.stringify(value)}'`;
    break;
  }
  default: {
    normalizedValue = String(value);
  }
  }
  return normalizedValue;
}
