/* eslint-disable no-unused-vars */
import { AbstractRenderer } from 'generators';
import { CommonModel } from '../models';
import { ConstrainedAnyModel, ConstrainedBooleanModel, ConstrainedFloatModel, ConstrainedIntegerModel, ConstrainedMetaModel, ConstrainedObjectModel, ConstrainedReferenceModel, ConstrainedStringModel, ConstrainedTupleModel, ConstrainedArrayModel, ConstrainedUnionModel, ConstrainedEnumModel, ConstrainedDictionaryModel } from '../models/ConstrainedMetaModel';

export enum ModelKind {
  OBJECT = 'object',
  ARRAY = 'array',
  ENUM = 'enum',
  UNION = 'union',
  PRIMITIVE = 'primitive',
}

export class TypeHelpers {
  /**
   * Returns the type (object | array | union | enum | primitive) of the model
   * @param model to check
   * @returns {ModelKind}
   */
  static extractKind(model: CommonModel): ModelKind {
    if (model.type === 'object') {return ModelKind.OBJECT;}
    if (model.type === 'array') {return ModelKind.ARRAY;}
    if (Array.isArray(model.enum)) {return ModelKind.ENUM;}
    if (Array.isArray(model.type)) {return ModelKind.UNION;}
    return ModelKind.PRIMITIVE;
  }
}

export type TypeContext<T extends ConstrainedMetaModel, R extends AbstractRenderer> = {
  propertyKey?: string,
  renderer: R,
  constrainedModel: T,
}

export type TypeMappingFunction<T extends ConstrainedMetaModel, R extends AbstractRenderer> = (context: TypeContext<T, R>) => string;

export type TypeMapping<R extends AbstractRenderer> = {
  Object: TypeMappingFunction<ConstrainedObjectModel, R>,
  Reference: TypeMappingFunction<ConstrainedReferenceModel, R>,
  Any: TypeMappingFunction<ConstrainedAnyModel, R>,
  Float: TypeMappingFunction<ConstrainedFloatModel, R>,
  Integer: TypeMappingFunction<ConstrainedIntegerModel, R>,
  String: TypeMappingFunction<ConstrainedStringModel, R>,
  Boolean: TypeMappingFunction<ConstrainedBooleanModel, R>,
  Tuple: TypeMappingFunction<ConstrainedTupleModel, R>,
  Array: TypeMappingFunction<ConstrainedArrayModel, R>,
  Enum: TypeMappingFunction<ConstrainedEnumModel, R>,
  Union: TypeMappingFunction<ConstrainedUnionModel, R>,
  Dictionary: TypeMappingFunction<ConstrainedDictionaryModel, R>
};

export function getTypeFromMapping<T extends ConstrainedMetaModel, R extends AbstractRenderer>(typeMapping: TypeMapping<R>, context: TypeContext<T, R>): string {
  if (context.constrainedModel instanceof ConstrainedObjectModel) {
    return typeMapping.Object({...context, constrainedModel: context.constrainedModel});
  } else if (context.constrainedModel instanceof ConstrainedReferenceModel) {
    return typeMapping.Reference({...context, constrainedModel: context.constrainedModel});
  } else if (context.constrainedModel instanceof ConstrainedAnyModel) {
    return typeMapping.Any(context);
  } else if (context.constrainedModel instanceof ConstrainedFloatModel) {
    return typeMapping.Float(context);
  } else if (context.constrainedModel instanceof ConstrainedIntegerModel) {
    return typeMapping.Integer(context);
  } else if (context.constrainedModel instanceof ConstrainedStringModel) {
    return typeMapping.String(context);
  } else if (context.constrainedModel instanceof ConstrainedBooleanModel) {
    return typeMapping.Boolean(context);
  } else if (context.constrainedModel instanceof ConstrainedTupleModel) {
    return typeMapping.Tuple({...context, constrainedModel: context.constrainedModel});
  } else if (context.constrainedModel instanceof ConstrainedArrayModel) {
    return typeMapping.Array({...context, constrainedModel: context.constrainedModel});
  } else if (context.constrainedModel instanceof ConstrainedEnumModel) {
    return typeMapping.Enum({...context, constrainedModel: context.constrainedModel});
  } else if (context.constrainedModel instanceof ConstrainedUnionModel) {
    return typeMapping.Union({...context, constrainedModel: context.constrainedModel});
  } else if (context.constrainedModel instanceof ConstrainedDictionaryModel) {
    return typeMapping.Dictionary({...context, constrainedModel: context.constrainedModel});
  }
  throw new Error('Could not find type for model');
}
