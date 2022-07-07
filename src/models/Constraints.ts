import { ConstrainedEnumModel, ConstrainedObjectModel, ConstrainedObjectPropertyModel } from './ConstrainedMetaModel';
import { EnumModel, MetaModel, ObjectModel, ObjectPropertyModel } from './MetaModel';

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
export type EnumValueConstraint = (context: EnumValueContext) => string;

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
