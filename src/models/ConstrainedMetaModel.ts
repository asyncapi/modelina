import { MetaModel } from './MetaModel';

export class ConstrainedMetaModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any,
    public type: string,
    isNullable = false) {
    super(name, originalInput, isNullable);
  }
}

export class ConstrainedReferenceModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public ref: ConstrainedMetaModel,
    isNullable = false) {
    super(name, originalInput, type, isNullable);
  }
}
export class ConstrainedAnyModel extends ConstrainedMetaModel { }
export class ConstrainedFloatModel extends ConstrainedMetaModel { }
export class ConstrainedIntegerModel extends ConstrainedMetaModel { }
export class ConstrainedStringModel extends ConstrainedMetaModel { }
export class ConstrainedBooleanModel extends ConstrainedMetaModel { }
export class ConstrainedTupleValueModel {
  constructor(
    public index: number, 
    public value: ConstrainedMetaModel) {
  }
}
export class ConstrainedTupleModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public tuple: ConstrainedTupleValueModel[],
    isNullable = false) {
    super(name, originalInput, type, isNullable);
  }
}
export class ConstrainedObjectPropertyModel {
  constructor(
    public propertyName: string,
    public required: boolean,
    public property: ConstrainedMetaModel) {
  }
}
export class ConstrainedObjectModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public properties: { [key: string]: ConstrainedObjectPropertyModel; },
    isNullable = false) {
    super(name, originalInput, type, isNullable);
  }
}
export class ConstrainedArrayModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public valueModel: ConstrainedMetaModel,
    isNullable = false) {
    super(name, originalInput, type, isNullable);
  }
}
export class ConstrainedUnionModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public union: ConstrainedMetaModel[],
    isNullable = false) {
    super(name, originalInput, type, isNullable);
  }
}
export class ConstrainedEnumValueModel {
  constructor(
    public key: string, 
    public value: any) {
  }
}
export class ConstrainedEnumModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public values: ConstrainedEnumValueModel[],
    isNullable = false) {
    super(name, originalInput, type, isNullable);
  }
}
export class ConstrainedDictionaryModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public key: ConstrainedMetaModel, 
    public value: ConstrainedMetaModel, 
    public serializationType: 'unwrap' | 'normal' = 'normal',
    isNullable = false) {
    super(name, originalInput, type, isNullable);
  }
}
