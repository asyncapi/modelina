export class MetaModel {
  constructor(
    public name: string,
    public originalInput: any,
    public isNullable = false) {
  }
}

export class ReferenceModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any,
    public ref: MetaModel,
    isNullable = false) {
    super(name, originalInput, isNullable);
  }
}
export class AnyModel extends MetaModel { }
export class FloatModel extends MetaModel { }
export class IntegerModel extends MetaModel { }
export class StringModel extends MetaModel { }
export class BooleanModel extends MetaModel { }
export class TupleValueModel {
  constructor(
    public index: number, 
    public value: MetaModel) {
  }
}
export class TupleModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any,
    public tuple: TupleValueModel[],
    isNullable = false) {
    super(name, originalInput, isNullable);
  }
}
export class ObjectPropertyModel {
  constructor(
    public propertyName: string,
    public required: boolean,
    public property: MetaModel) {
  }
}
export class ObjectModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any,
    public properties: { [key: string]: ObjectPropertyModel; },
    isNullable = false) {
    super(name, originalInput);
  }
}
export class ArrayModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any, 
    public valueModel: MetaModel,
    isNullable = false) {
    super(name, originalInput, isNullable);
  }
}
export class UnionModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any, 
    public union: MetaModel[],
    isNullable = false) {
    super(name, originalInput, isNullable);
  }
}
export class EnumValueModel {
  constructor(
    public key: string, 
    public value: any) {
  }
}
export class EnumModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any, 
    public values: EnumValueModel[],
    isNullable = false) {
    super(name, originalInput, isNullable);
  }
}
export class DictionaryModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any, 
    public key: MetaModel, 
    public value: MetaModel,
    public serializationType: 'unwrap' | 'normal' = 'normal',
    isNullable = false) {
    super(name, originalInput, isNullable);
  }
}
