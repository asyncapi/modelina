/* eslint-disable @typescript-eslint/ban-types */
import { AbstractRenderer } from '../AbstractRenderer';
import {
  Preset,
  CommonPreset,
  PresetArgs,
  ConstrainedEnumValueModel,
  ConstrainedUnionModel,
  ConstrainedMetaModel,
  ConstrainedTupleModel,
  ConstrainedEnumModel,
  ConstrainedObjectModel,
  ConstrainedObjectPropertyModel,
  ConstrainedTupleValueModel,
  InputMetaModel
} from '../../models';
import { RustOptions, RustPackageOptions } from './RustGenerator';
import {
  StructRenderer,
  RUST_DEFAULT_STRUCT_PRESET
} from './renderers/StructRenderer';
import {
  EnumRenderer,
  RUST_DEFAULT_ENUM_PRESET
} from './renderers/EnumRenderer';
import {
  TupleRenderer,
  RUST_DEFAULT_TUPLE_PRESET
} from './renderers/TupleRenderer';
import {
  UnionRenderer,
  RUST_DEFAULT_UNION_PRESET
} from './renderers/UnionRenderer';
import {
  PackageRenderer,
  RUST_DEFAULT_PACKAGE_PRESET
} from './renderers/PackageRenderer';
import {
  NewTypeRenderer,
  RUST_DEFAULT_NEW_TYPE_PRESET
} from './renderers/NewTypeRenderer';

export interface StructFieldArgs {
  field: ConstrainedObjectPropertyModel;
}

export interface TupleFieldArgs {
  field: ConstrainedTupleValueModel;
  fieldIndex: number;
}

export interface UnionArgs {
  item: ConstrainedMetaModel;
}

export interface EnumArgs {
  item: ConstrainedEnumValueModel;
  itemIndex: number;
}

export interface RustStructPreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedObjectModel> {
  field?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & StructFieldArgs
  ) => Promise<string> | string;
  fieldMacro?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & StructFieldArgs
  ) => Promise<string> | string;
  structMacro?: (
    args: PresetArgs<R, O, ConstrainedObjectModel> & StructFieldArgs
  ) => Promise<string> | string;
}

export interface RustTuplePreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedTupleModel> {
  field?: (
    args: PresetArgs<R, O, ConstrainedTupleModel> & TupleFieldArgs
  ) => Promise<string> | string;
  structMacro?: (
    args: PresetArgs<R, O, ConstrainedTupleModel>
  ) => Promise<string> | string;
}

export interface RustNewTypePreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedMetaModel> {
  field?: (
    args: PresetArgs<R, O, ConstrainedMetaModel>
  ) => Promise<string> | string;
  structMacro?: (
    args: PresetArgs<R, O, ConstrainedMetaModel>
  ) => Promise<string> | string;
}

export interface RustEnumPreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedEnumModel> {
  item?: (args: PresetArgs<R, O, ConstrainedEnumModel> & EnumArgs) => string;
  itemMacro?: (
    args: PresetArgs<R, O, ConstrainedEnumModel> & EnumArgs
  ) => string;
  structMacro?: (
    args: PresetArgs<R, O, ConstrainedEnumModel>
  ) => Promise<string> | string;
}

export interface RustUnionPreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedUnionModel> {
  item?: (args: PresetArgs<R, O, ConstrainedUnionModel> & UnionArgs) => string;
  itemMacro?: (
    args: PresetArgs<R, O, ConstrainedUnionModel> & UnionArgs
  ) => string;
  structMacro?: (
    args: PresetArgs<R, O, ConstrainedUnionModel>
  ) => Promise<string> | string;
}

export interface PackageArgs {
  packageOptions: RustPackageOptions;
  inputModel: InputMetaModel;
}
export interface RustPackagePreset<R extends AbstractRenderer, O>
  extends CommonPreset<R, O, ConstrainedUnionModel> {
  manifest?: (
    args: PresetArgs<R, O, ConstrainedMetaModel> & PackageArgs
  ) => string;
  lib?: (args: PresetArgs<R, O, ConstrainedMetaModel> & PackageArgs) => string;
}

export type EnumPresetType<O> = RustEnumPreset<EnumRenderer, O>;
export type StructPresetType<O> = RustStructPreset<StructRenderer, O>;
export type TuplePresetType<O> = RustTuplePreset<TupleRenderer, O>;
export type NewTypePresetType<O> = RustNewTypePreset<NewTypeRenderer, O>;
export type UnionPresetType<O> = RustUnionPreset<UnionRenderer, O>;
export type PackagePresetType<O> = RustPackagePreset<PackageRenderer, O>;

export type RustPreset<O = any> = Preset<{
  struct: StructPresetType<O>;
  enum: EnumPresetType<O>;
  tuple: TuplePresetType<O>;
  newType: NewTypePresetType<O>;
  union: UnionPresetType<O>;
  package: PackagePresetType<O>;
}>;

export const RUST_DEFAULT_PRESET: RustPreset<RustOptions> = {
  struct: RUST_DEFAULT_STRUCT_PRESET,
  enum: RUST_DEFAULT_ENUM_PRESET,
  tuple: RUST_DEFAULT_TUPLE_PRESET,
  newType: RUST_DEFAULT_NEW_TYPE_PRESET,
  union: RUST_DEFAULT_UNION_PRESET,
  package: RUST_DEFAULT_PACKAGE_PRESET
};
