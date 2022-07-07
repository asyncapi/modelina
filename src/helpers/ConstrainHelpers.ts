import { ConstrainContext, Constraints } from 'models/Constraints';
import { ConstrainedAnyModel, ConstrainedBooleanModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedMetaModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedTupleValueModel, ConstrainedArrayModel, ConstrainedUnionModel, ConstrainedEnumModel, ConstrainedDictionaryModel, ConstrainedEnumValueModel, ConstrainedObjectPropertyModel } from '../models/ConstrainedMetaModel';
import { AnyModel, BooleanModel, FloatModel, IntegerModel, ObjectModel, ReferenceModel, StringModel, TupleModel, ArrayModel, UnionModel, EnumModel, DictionaryModel, MetaModel } from '../models/MetaModel';
import { getTypeFromMapping, TypeMapping } from './TypeHelpers';

function constrainReferenceModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, ReferenceModel>): ConstrainedReferenceModel {
  const constrainedRefModel = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: context.metaModel.ref, propertyKey: undefined});
  const constrainedModel = new ConstrainedReferenceModel(context.constrainedName, context.metaModel.originalInput, '', context.metaModel, constrainedRefModel);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainAnyModel<Options>(typeMapping: TypeMapping<Options>, context: ConstrainContext<Options, AnyModel>): ConstrainedAnyModel {
  const constrainedModel = new ConstrainedAnyModel(context.constrainedName, context.metaModel.originalInput, '', context.metaModel);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel; 
}
function constrainFloatModel<Options>(typeMapping: TypeMapping<Options>, context: ConstrainContext<Options, FloatModel>): ConstrainedFloatModel {
  const constrainedModel = new ConstrainedFloatModel(context.constrainedName, context.metaModel.originalInput, '', context.metaModel);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainIntegerModel<Options>(typeMapping: TypeMapping<Options>, context: ConstrainContext<Options, IntegerModel>): ConstrainedIntegerModel {
  const constrainedModel = new ConstrainedIntegerModel(context.constrainedName, context.metaModel.originalInput, '', context.metaModel);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainStringModel<Options>(typeMapping: TypeMapping<Options>, context: ConstrainContext<Options, StringModel>): ConstrainedStringModel {
  const constrainedModel = new ConstrainedStringModel(context.constrainedName, context.metaModel.originalInput, '', context.metaModel);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainBooleanModel<Options>(typeMapping: TypeMapping<Options>, context: ConstrainContext<Options, BooleanModel>): ConstrainedBooleanModel {
  const constrainedModel = new ConstrainedBooleanModel(context.constrainedName, context.metaModel.originalInput, '', context.metaModel);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainTupleModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, TupleModel>): ConstrainedTupleModel {
  const constrainedTupleModels = context.metaModel.tuple.map((tupleValue) => {
    const tupleType = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: tupleValue.value, propertyKey: undefined});
    return new ConstrainedTupleValueModel(tupleValue.index, tupleType);
  });
  const constrainedModel = new ConstrainedTupleModel(context.constrainedName, context.metaModel.originalInput, '', context.metaModel, constrainedTupleModels);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainArrayModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, ArrayModel>): ConstrainedArrayModel {
  const constrainedValueModel = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: context.metaModel.valueModel, propertyKey: undefined});
  const constrainedModel = new ConstrainedArrayModel(context.constrainedName, context.metaModel.originalInput, '', context.metaModel, constrainedValueModel);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainUnionModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, UnionModel>): ConstrainedUnionModel {
  const constrainedUnionModels = context.metaModel.union.map((unionValue) => {
    return constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: unionValue, propertyKey: undefined});
  });
  const constrainedModel = new ConstrainedUnionModel(context.constrainedName, context.metaModel.originalInput, '', context.metaModel, constrainedUnionModels);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainDictionaryModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, DictionaryModel>): ConstrainedDictionaryModel {
  const keyModel = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: context.metaModel.key, propertyKey: undefined});
  const valueModel = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: context.metaModel.value, propertyKey: undefined});
  const constrainedModel = new ConstrainedDictionaryModel(context.constrainedName, context.metaModel.originalInput, '', context.metaModel, keyModel, valueModel, context.metaModel.serializationType);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}

function constrainObjectModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, ObjectModel>): ConstrainedObjectModel {
  const constrainedModel = new ConstrainedObjectModel(context.constrainedName, context.metaModel.originalInput, '', context.metaModel, {});
  for (const propertyMetaModel of Object.values(context.metaModel.properties)) {
    const constrainedPropertyModel = new ConstrainedObjectPropertyModel('', propertyMetaModel.required, constrainedModel, propertyMetaModel);
    const constrainedPropertyName = constrainRules.propertyKey({objectPropertyModel: propertyMetaModel, constrainedObjectPropertyModel: constrainedPropertyModel, constrainedObjectModel: constrainedModel, objectModel: context.metaModel});
    constrainedPropertyModel.propertyName = constrainedPropertyName;
    const constrainedProperty = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: propertyMetaModel.property, propertyKey: constrainedPropertyName});
    constrainedPropertyModel.property = constrainedProperty;
    constrainedModel.properties[String(constrainedPropertyName)] = constrainedPropertyModel;
  }
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}

function ConstrainEnumModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, EnumModel>): ConstrainedEnumModel {
  const constrainedModel = new ConstrainedEnumModel(context.constrainedName, context.metaModel.originalInput, '', context.metaModel, []);

  for (const enumValue of context.metaModel.values) {
    const constrainedEnumKey = constrainRules.enumKey({enumKey: String(enumValue.key), enumModel: context.metaModel, constrainedEnumModel: constrainedModel});
    const constrainedEnumValue = constrainRules.enumValue({enumValue: String(enumValue.value), enumModel: context.metaModel, constrainedEnumModel: constrainedModel});

    const constrainedEnumValueModel = new ConstrainedEnumValueModel(constrainedEnumKey, constrainedEnumValue);
    constrainedModel.values.push(constrainedEnumValueModel);
  }
  constrainedModel.type = getTypeFromMapping(typeMapping, {constrainedModel, options: context.options, propertyKey: context.propertyKey});
  return constrainedModel;
}

export function constrainMetaModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, MetaModel>): ConstrainedMetaModel {
  const constrainedName = constrainRules.modelName({modelName: context.metaModel.name});
  const newContext = {...context, constrainedName};
  if (newContext.metaModel instanceof ObjectModel) {
    return constrainObjectModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  } else if (newContext.metaModel instanceof ReferenceModel) {
    return constrainReferenceModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  } else if (newContext.metaModel instanceof AnyModel) {
    return constrainAnyModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
  } else if (newContext.metaModel instanceof FloatModel) {
    return constrainFloatModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
  } else if (newContext.metaModel instanceof IntegerModel) {
    return constrainIntegerModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
  } else if (newContext.metaModel instanceof StringModel) {
    return constrainStringModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
  } else if (newContext.metaModel instanceof BooleanModel) {
    return constrainBooleanModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
  } else if (newContext.metaModel instanceof TupleModel) {
    return constrainTupleModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  } else if (newContext.metaModel instanceof ArrayModel) {
    return constrainArrayModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  } else if (newContext.metaModel instanceof UnionModel) {
    return constrainUnionModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  } else if (newContext.metaModel instanceof EnumModel) {
    return ConstrainEnumModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  } else if (newContext.metaModel instanceof DictionaryModel) {
    return constrainDictionaryModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  }
  throw new Error('Could not constrain model');
}
