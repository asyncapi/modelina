import { MetaModel } from './MetaModel';

export class ConstrainedMetaModel extends MetaModel {
  constructor(
    public name: string,
    public originalInput: any, 
    public type: string) {
    super(name, originalInput);
  }
}

export class ConstrainedReferenceModel extends ConstrainedMetaModel {
  constructor(
    public name: string,
    public originalInput: any, 
    public type: string, 
    public ref: ConstrainedMetaModel) {
    super(name, originalInput, type);
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
    public name: string,
    public originalInput: any, 
    public type: string, 
    public tuple: ConstrainedTupleValueModel[]) {
    super(name, originalInput, type);
  }
}
export class ConstrainedObjectModel extends ConstrainedMetaModel {
  constructor(
    public name: string,
    public originalInput: any, 
    public type: string, 
    public properties: { [key: string]: ConstrainedMetaModel; }) {
    super(name, originalInput, type);
  }
}
export class ConstrainedArrayModel extends ConstrainedMetaModel {
  constructor(
    public name: string,
    public originalInput: any, 
    public type: string, 
    public valueModel: ConstrainedMetaModel) {
    super(name, originalInput, type);
  }
}
export class ConstrainedUnionModel extends ConstrainedMetaModel {
  constructor(
    public name: string,
    public originalInput: any, 
    public type: string, 
    public union: ConstrainedMetaModel[]) {
    super(name, originalInput, type);
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
    public name: string,
    public originalInput: any, 
    public type: string, 
    public values: ConstrainedEnumValueModel[]) {
    super(name, originalInput, type);
  }
}
export class ConstrainedDictionaryModel extends ConstrainedMetaModel {
  constructor(
    public name: string,
    public originalInput: any, 
    public type: string, 
    public key: ConstrainedMetaModel, 
    public value: ConstrainedMetaModel, 
    public serializationType: 'unwrap' | 'normal' = 'normal') {
    super(name, originalInput, type);
  }
}
