export class MetaModel {
  name: string;
  originalInput: any;
  constructor(name: string) {
    this.name = name;
  }
}

export class ReferencedModel extends MetaModel {
  referencedModel?: MetaModel
}
export class AnyModel extends MetaModel { }
export class FloatModel extends MetaModel { }
export class IntegerModel extends MetaModel { }
export class StringModel extends MetaModel { }
export class BooleanModel extends MetaModel { }
export class TupleValueModel {
  index: number;
  value: MetaModel;
  constructor(index: number, value: MetaModel) {
    this.index = index;
    this.value = value;
  }
}
export class TupleModel extends MetaModel {
  tupleModels: TupleValueModel[] = [];
}
export class ObjectModel extends MetaModel {
  properties: { [key: string]: MetaModel; } = {};
}
export class ArrayModel extends MetaModel {
  valueModel: MetaModel;
  constructor(name: string, valueModel: MetaModel) {
    super(name);
    this.valueModel = valueModel;
  }
}
export class UnionModel extends MetaModel {
  unionModels: MetaModel[] = [];
}
export class EnumValueModel {
  key: string;
  value: any;
  constructor(key: string, value: any) {
    this.key = key;
    this.value = value;
  }
}
export class EnumModel extends MetaModel {
  values: EnumValueModel[] = [];
}
export class DictionaryModel extends MetaModel {
  keyModel: MetaModel;
  valueModel: MetaModel;
  serializationType: 'unwrap' | 'normal' = 'normal';

  constructor(name: string, keyModel: MetaModel, valueModel: MetaModel) {
    super(name);
    this.keyModel = keyModel;
    this.valueModel = valueModel;
  }
}