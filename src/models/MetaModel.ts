export class MetaModel {
  constructor(public name: string, public originalInput: any) {}
}

export class ReferenceModel extends MetaModel {
  constructor(name: string, originalInput: any, public ref: MetaModel) {
    super(name, originalInput);
  }
}
export class AnyModel extends MetaModel {}
export class FloatModel extends MetaModel {}
export class IntegerModel extends MetaModel {}
export class StringModel extends MetaModel {}
export class BooleanModel extends MetaModel {}
export class TupleValueModel {
  constructor(public index: number, public value: MetaModel) {}
}
export class TupleModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any,
    public tuple: TupleValueModel[]
  ) {
    super(name, originalInput);
  }
}
export class ObjectPropertyModel {
  constructor(
    public propertyName: string,
    public required: boolean,
    public property: MetaModel
  ) {}
}
export class ObjectModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any,
    public properties: { [key: string]: ObjectPropertyModel }
  ) {
    super(name, originalInput);
  }
}
export class ArrayModel extends MetaModel {
  constructor(name: string, originalInput: any, public valueModel: MetaModel) {
    super(name, originalInput);
  }
}
export class UnionModel extends MetaModel {
  constructor(name: string, originalInput: any, public union: MetaModel[]) {
    super(name, originalInput);
  }
}
export class EnumValueModel {
  constructor(public key: string, public value: any) {}
}
export class EnumModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any,
    public values: EnumValueModel[]
  ) {
    super(name, originalInput);
  }
}
export class DictionaryModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any,
    public key: MetaModel,
    public value: MetaModel,
    public serializationType: 'unwrap' | 'normal' = 'normal'
  ) {
    super(name, originalInput);
  }
}
