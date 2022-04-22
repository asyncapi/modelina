
import { AbstractRenderer } from 'generators';
import { ConstrainedAnyModel, ConstrainedBooleanModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedMetaModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedTupleValueModel, ConstrainedArrayModel, ConstrainedUnionModel, ConstrainedEnumModel, ConstrainedDictionaryModel, ConstrainedEnumValueModel } from '../models/ConstrainedMetaModel';
import { AnyModel, BooleanModel, FloatModel, IntegerModel, ObjectModel, ReferenceModel, StringModel, TupleModel, ArrayModel, UnionModel, EnumModel, DictionaryModel, MetaModel } from '../models/MetaModel';
import { getTypeFromMapping, TypeMapping } from './TypeHelpers';

export type ConstrainContext<R extends AbstractRenderer, M extends MetaModel> = {
  propertyKey?: string,
  metaModel: M,
  constrainedName: string,
  renderer: R
}

export type EnumKeyContext = {
  enumKey: string,
  constrainedEnumModel: ConstrainedEnumModel,
  enumModel: EnumModel
}
export type EnumKeyConstraint = (context: EnumKeyContext) => string;

export type EnumValueContext = {
  enumValue: string,
  constrainedEnumModel: ConstrainedEnumModel,
  enumModel: EnumModel
}
export type EnumValueConstraint = (context: EnumValueContext) => string;

export type ModelNameContext = {
  modelName: string
}
export type ModelNameConstraint = (context: ModelNameContext) => string;

export type PropertyKeyContext = {
  propertyKey: string,
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

export interface OptionalConstraints {
  enumKey?: EnumKeyConstraint,
  enumValue?: EnumValueConstraint,
  modelName?: ModelNameConstraint,
  propertyKey?: PropertyKeyConstraint,
}

function constrainReferenceModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, constrainRules: Constraints, context: ConstrainContext<R, ReferenceModel>): ConstrainedReferenceModel {
  const constrainedRefModel = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: context.metaModel.ref, propertyKey: undefined});
  const constrainedModel = new ConstrainedReferenceModel(context.constrainedName, context.metaModel.originalInput, '', constrainedRefModel);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    renderer: context.renderer,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainAnyModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, context: ConstrainContext<R, AnyModel>): ConstrainedAnyModel {
  const constrainedModel = new ConstrainedAnyModel(context.constrainedName, context.metaModel.originalInput, '');
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    renderer: context.renderer,
    propertyKey: context.propertyKey
  });
  return constrainedModel; 
}
function constrainFloatModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, context: ConstrainContext<R, FloatModel>): ConstrainedFloatModel {
  const constrainedModel = new ConstrainedFloatModel(context.constrainedName, context.metaModel.originalInput, '');
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    renderer: context.renderer,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainIntegerModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, context: ConstrainContext<R, IntegerModel>): ConstrainedIntegerModel {
  const constrainedModel = new ConstrainedIntegerModel(context.constrainedName, context.metaModel.originalInput, '');
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    renderer: context.renderer,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainStringModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, context: ConstrainContext<R, StringModel>): ConstrainedStringModel {
  const constrainedModel = new ConstrainedStringModel(context.constrainedName, context.metaModel.originalInput, '');
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    renderer: context.renderer,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainBooleanModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, context: ConstrainContext<R, BooleanModel>): ConstrainedBooleanModel {
  const constrainedModel = new ConstrainedBooleanModel(context.constrainedName, context.metaModel.originalInput, '');
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    renderer: context.renderer,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainTupleModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, constrainRules: Constraints, context: ConstrainContext<R, TupleModel>): ConstrainedTupleModel {
  const constrainedTupleModels = context.metaModel.tuple.map((tupleValue) => {
    const tupleType = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: tupleValue.value, propertyKey: undefined});
    return new ConstrainedTupleValueModel(tupleValue.index, tupleType);
  });
  const constrainedModel = new ConstrainedTupleModel(context.constrainedName, context.metaModel.originalInput, '', constrainedTupleModels);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    renderer: context.renderer,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainArrayModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, constrainRules: Constraints, context: ConstrainContext<R, ArrayModel>): ConstrainedArrayModel {
  const constrainedValueModel = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: context.metaModel.valueModel, propertyKey: undefined});
  const constrainedModel = new ConstrainedArrayModel(context.constrainedName, context.metaModel.originalInput, '', constrainedValueModel);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    renderer: context.renderer,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainUnionModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, constrainRules: Constraints, context: ConstrainContext<R, UnionModel>): ConstrainedUnionModel {
  const constrainedUnionModels = context.metaModel.union.map((unionValue) => {
    return constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: unionValue, propertyKey: undefined});
  });
  const constrainedModel = new ConstrainedUnionModel(context.constrainedName, context.metaModel.originalInput, '', constrainedUnionModels);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    renderer: context.renderer,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}
function constrainDictionaryModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, constrainRules: Constraints, context: ConstrainContext<R, DictionaryModel>): ConstrainedDictionaryModel {
  const keyModel = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: context.metaModel.key, propertyKey: undefined});
  const valueModel = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: context.metaModel.value, propertyKey: undefined});
  const constrainedModel = new ConstrainedDictionaryModel(context.constrainedName, context.metaModel.originalInput, '', keyModel, valueModel, context.metaModel.serializationType);
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    renderer: context.renderer,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}

function constrainObjectModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, constrainRules: Constraints, context: ConstrainContext<R, ObjectModel>): ConstrainedObjectModel {
  const constrainedModel = new ConstrainedObjectModel(context.constrainedName, context.metaModel.originalInput, '', {});
  for (const [propertyKey, propertyMetaModel] of Object.entries(context.metaModel.properties)) {
    const constrainedPropertyName = constrainRules.propertyKey({propertyKey, constrainedObjectModel: constrainedModel, objectModel: context.metaModel});
    const constrainedProperty = constrainMetaModel(typeMapping, constrainRules, {...context, metaModel: propertyMetaModel, propertyKey: constrainedPropertyName});
    constrainedModel.properties[String(constrainedPropertyName)] = constrainedProperty;
  }
  constrainedModel.type = getTypeFromMapping(typeMapping, {
    constrainedModel,
    renderer: context.renderer,
    propertyKey: context.propertyKey
  });
  return constrainedModel;
}

export function ConstrainEnumModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, constrainRules: Constraints, context: ConstrainContext<R, EnumModel>): ConstrainedEnumModel {
  const constrainedModel = new ConstrainedEnumModel(context.constrainedName, context.metaModel.originalInput, '', []);

  for (const enumValue of context.metaModel.values) {
    const constrainedEnumKey = constrainRules.enumKey({enumKey: String(enumValue.key), enumModel: context.metaModel, constrainedEnumModel: constrainedModel});
    const constrainedEnumValue = constrainRules.enumKey({enumKey: String(enumValue.key), enumModel: context.metaModel, constrainedEnumModel: constrainedModel});

    const constrainedEnumValueModel = new ConstrainedEnumValueModel(constrainedEnumKey, constrainedEnumValue);
    constrainedModel.values.push(constrainedEnumValueModel);
  }
  constrainedModel.type = getTypeFromMapping(typeMapping, {constrainedModel, renderer: context.renderer, propertyKey: context.propertyKey});
  return constrainedModel;
}

export function constrainMetaModel<R extends AbstractRenderer>(typeMapping: TypeMapping<R>, constrainRules: Constraints, context: ConstrainContext<R, MetaModel>): ConstrainedMetaModel {
  const constrainedName = constrainRules.modelName({modelName: context.metaModel.name});
  const newContext = {...context, constrainedName};
  if (newContext.metaModel instanceof ObjectModel) {
    return constrainObjectModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  } else if (context.metaModel instanceof ReferenceModel) {
    return constrainReferenceModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  } else if (context.metaModel instanceof AnyModel) {
    return constrainAnyModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
  } else if (context.metaModel instanceof FloatModel) {
    return constrainFloatModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
  } else if (context.metaModel instanceof IntegerModel) {
    return constrainIntegerModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
  } else if (context.metaModel instanceof StringModel) {
    return constrainStringModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
  } else if (context.metaModel instanceof BooleanModel) {
    return constrainBooleanModel(typeMapping, {...newContext, metaModel: newContext.metaModel});
  } else if (context.metaModel instanceof TupleModel) {
    return constrainTupleModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  } else if (context.metaModel instanceof ArrayModel) {
    return constrainArrayModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  } else if (context.metaModel instanceof UnionModel) {
    return constrainUnionModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  } else if (context.metaModel instanceof EnumModel) {
    return ConstrainEnumModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  } else if (context.metaModel instanceof DictionaryModel) {
    return constrainDictionaryModel(typeMapping, constrainRules, {...newContext, metaModel: newContext.metaModel});
  }
  throw new Error('Could not constrain model');
}
