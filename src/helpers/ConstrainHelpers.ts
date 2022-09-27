import { ConstrainedAnyModel, ConstrainedBooleanModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedMetaModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedTupleValueModel, ConstrainedArrayModel, ConstrainedUnionModel, ConstrainedEnumModel, ConstrainedDictionaryModel, ConstrainedEnumValueModel, ConstrainedObjectPropertyModel } from '../models/ConstrainedMetaModel';
import { AnyModel, BooleanModel, FloatModel, IntegerModel, ObjectModel, ReferenceModel, StringModel, TupleModel, ArrayModel, UnionModel, EnumModel, DictionaryModel, MetaModel, ObjectPropertyModel } from '../models/MetaModel';
import { getTypeFromMapping, TypeMapping } from './TypeHelpers';

export type ConstrainContext<Options, M extends MetaModel> = {
  propertyKey?: string,
  metaModel: M,
  constrainedName: string,
  options: Options
}

export type EnumKeyContext = {
  enumKey: string,
  constrainedEnumModel: ConstrainedEnumModel,
  enumModel: EnumModel
}
export type EnumKeyConstraint = (context: EnumKeyContext) => string;

export type EnumValueContext = {
  enumValue: any,
  constrainedEnumModel: ConstrainedEnumModel,
  enumModel: EnumModel
}
export type EnumValueConstraint = (context: EnumValueContext) => any;

export type ModelNameContext = {
  modelName: string
}
export type ModelNameConstraint = (context: ModelNameContext) => string;

export type PropertyKeyContext = {
  constrainedObjectPropertyModel: ConstrainedObjectPropertyModel,
  objectPropertyModel: ObjectPropertyModel,
  constrainedObjectModel: ConstrainedObjectModel,
  objectModel: ObjectModel
}

export type PropertyKeyConstraint = (context: PropertyKeyContext) => string;

export interface Constraints {
  enumKey: EnumKeyConstraint,
  enumValue: EnumValueConstraint,
  modelName: ModelNameConstraint,
  propertyKey: PropertyKeyConstraint,
}

const placeHolderConstrainedObject = new ConstrainedAnyModel('', undefined, '');

function constrainReferenceModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, ReferenceModel>, alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>): ConstrainedReferenceModel {
  const constrainedModel = new ConstrainedReferenceModel(context.constrainedName, context.metaModel.originalInput, '', placeHolderConstrainedObject);
  alreadySeenModels.set(context.metaModel, constrainedModel); 

  const constrainedRefModel = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: context.metaModel.ref, propertyKey: undefined}, alreadySeenModels);
  constrainedModel.ref = constrainedRefModel;
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainAnyModel<Options>(typeMapping: TypeMapping<Options>, context: ConstrainContext<Options, AnyModel>): ConstrainedAnyModel {
  const constrainedModel = new ConstrainedAnyModel(context.constrainedName, context.metaModel.originalInput, '');
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel; 
}
function constrainFloatModel<Options>(typeMapping: TypeMapping<Options>, context: ConstrainContext<Options, FloatModel>): ConstrainedFloatModel {
  const constrainedModel = new ConstrainedFloatModel(context.constrainedName, context.metaModel.originalInput, '');
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainIntegerModel<Options>(typeMapping: TypeMapping<Options>, context: ConstrainContext<Options, IntegerModel>): ConstrainedIntegerModel {
  const constrainedModel = new ConstrainedIntegerModel(context.constrainedName, context.metaModel.originalInput, '');
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainStringModel<Options>(typeMapping: TypeMapping<Options>, context: ConstrainContext<Options, StringModel>): ConstrainedStringModel {
  const constrainedModel = new ConstrainedStringModel(context.constrainedName, context.metaModel.originalInput, '');
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainBooleanModel<Options>(typeMapping: TypeMapping<Options>, context: ConstrainContext<Options, BooleanModel>): ConstrainedBooleanModel {
  const constrainedModel = new ConstrainedBooleanModel(context.constrainedName, context.metaModel.originalInput, '');
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainTupleModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, TupleModel>, alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>): ConstrainedTupleModel {
  const constrainedModel = new ConstrainedTupleModel(context.constrainedName, context.metaModel.originalInput, '', []);
  alreadySeenModels.set(context.metaModel, constrainedModel); 

  const constrainedTupleModels = context.metaModel.tuple.map((tupleValue) => {
    const tupleType = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: tupleValue.value, propertyKey: undefined}, alreadySeenModels);
    return new ConstrainedTupleValueModel(tupleValue.index, tupleType);
  });
  constrainedModel.tuple = constrainedTupleModels;
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainArrayModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, ArrayModel>, alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>): ConstrainedArrayModel {
  const constrainedModel = new ConstrainedArrayModel(context.constrainedName, context.metaModel.originalInput, '', placeHolderConstrainedObject);
  alreadySeenModels.set(context.metaModel, constrainedModel);
  const constrainedValueModel = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: context.metaModel.valueModel, propertyKey: undefined}, alreadySeenModels);
  constrainedModel.valueModel = constrainedValueModel;
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainUnionModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, UnionModel>, alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>): ConstrainedUnionModel {
  const constrainedModel = new ConstrainedUnionModel(context.constrainedName, context.metaModel.originalInput, '', []);
  alreadySeenModels.set(context.metaModel, constrainedModel); 

  const constrainedUnionModels = context.metaModel.union.map((unionValue) => {
    return constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: unionValue, propertyKey: undefined}, alreadySeenModels);
  });
  constrainedModel.union = constrainedUnionModels;
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainDictionaryModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, DictionaryModel>, alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>): ConstrainedDictionaryModel {
  const constrainedModel = new ConstrainedDictionaryModel(context.constrainedName, context.metaModel.originalInput, '', placeHolderConstrainedObject, placeHolderConstrainedObject, context.metaModel.serializationType);
  alreadySeenModels.set(context.metaModel, constrainedModel);

  const keyModel = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: context.metaModel.key, propertyKey: undefined}, alreadySeenModels);
  constrainedModel.key = keyModel;
  const valueModel = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: context.metaModel.value, propertyKey: undefined}, alreadySeenModels);
  constrainedModel.value = valueModel;
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    options: context.options,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}

function constrainObjectModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, ObjectModel>, alreadySeenModels: Map<MetaModel, ConstrainedMetaModel>): ConstrainedObjectModel {
  const constrainedModel = new ConstrainedObjectModel(context.constrainedName, context.metaModel.originalInput, '', {});
  alreadySeenModels.set(context.metaModel, constrainedModel); 

  for (const propertyMetaModel of Object.values(context.metaModel.properties)) {
    const constrainedPropertyModel = new ConstrainedObjectPropertyModel('', propertyMetaModel.propertyName, propertyMetaModel.required, constrainedModel);
    const constrainedPropertyName = constrainRules.propertyKey({objectPropertyModel: propertyMetaModel, constrainedObjectPropertyModel: constrainedPropertyModel, constrainedObjectModel: constrainedModel, objectModel: context.metaModel});
    constrainedPropertyModel.propertyName = constrainedPropertyName;
    const constrainedProperty = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: propertyMetaModel.property, propertyKey: constrainedPropertyName}, alreadySeenModels);
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
  const constrainedModel = new ConstrainedEnumModel(context.constrainedName, context.metaModel.originalInput, '', []);

  for (const enumValue of context.metaModel.values) {
    const constrainedEnumKey = constrainRules.enumKey({enumKey: String(enumValue.key), enumModel: context.metaModel, constrainedEnumModel: constrainedModel});
    const constrainedEnumValue = constrainRules.enumValue({enumValue: enumValue.value, enumModel: context.metaModel, constrainedEnumModel: constrainedModel});

    const constrainedEnumValueModel = new ConstrainedEnumValueModel(constrainedEnumKey, constrainedEnumValue);
    constrainedModel.values.push(constrainedEnumValueModel);
  }
  constrainedModel.type = getTypeFromMapping(typeMapping, {constrainedModel, options: context.options, propertyKey: context.propertyKey});
  return constrainedModel;
}

export function constrainMetaModel<Options>(typeMapping: TypeMapping<Options>, constrainRules: Constraints, context: ConstrainContext<Options, MetaModel>, alreadySeenModels: Map<MetaModel, ConstrainedMetaModel> = new Map()): ConstrainedMetaModel {
  if (alreadySeenModels.has(context.metaModel)) {
    return alreadySeenModels.get(context.metaModel) as ConstrainedMetaModel;
  }
  const constrainedName = constrainRules.modelName({modelName: context.metaModel.name});
  const newContext = {...context, constrainedName};
  if (newContext.metaModel instanceof ObjectModel) {
    return constrainObjectModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel}, alreadySeenModels);
  } else if (newContext.metaModel instanceof ReferenceModel) {
    return constrainReferenceModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel}, alreadySeenModels);
  } else if (newContext.metaModel instanceof DictionaryModel) {
    return constrainDictionaryModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel}, alreadySeenModels);
  } else if (newContext.metaModel instanceof TupleModel) {
    return constrainTupleModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel}, alreadySeenModels);
  } else if (newContext.metaModel instanceof ArrayModel) {
    return constrainArrayModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel}, alreadySeenModels);
  } else if (newContext.metaModel instanceof UnionModel) {
    return constrainUnionModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel}, alreadySeenModels);
  } else {
    // Simple models are those who does not have properties that contain other MetaModels.
    let simpleModel: ConstrainedMetaModel | undefined;
    if (newContext.metaModel instanceof EnumModel) {
      simpleModel = ConstrainEnumModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
    }else if (newContext.metaModel instanceof BooleanModel) {
      simpleModel = constrainBooleanModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
    } else if (newContext.metaModel instanceof AnyModel) {
      simpleModel = constrainAnyModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
    } else if (newContext.metaModel instanceof FloatModel) {
      simpleModel = constrainFloatModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
    } else if (newContext.metaModel instanceof IntegerModel) {
      simpleModel = constrainIntegerModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
    } else if (newContext.metaModel instanceof StringModel) {
      simpleModel = constrainStringModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
    }
    if (simpleModel !== undefined) {
      alreadySeenModels.set(context.metaModel, simpleModel); 
      return simpleModel;
    }
  }
  throw new Error('Could not constrain model');
}
