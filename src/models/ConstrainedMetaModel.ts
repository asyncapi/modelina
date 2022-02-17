import { MetaModel } from "./MetaModel";

export class ConstrainedMetaModel extends MetaModel {
  type: string;
  constructor(name: string, type: string) {
    super(name);
    this.type = type;
  }
}

export class ConstrainedReferencedModel extends ConstrainedMetaModel {
  referencedModel?: ConstrainedMetaModel
}
export class ConstrainedAnyModel extends ConstrainedMetaModel { }
export class ConstrainedFloatModel extends ConstrainedMetaModel { }
export class ConstrainedIntegerModel extends ConstrainedMetaModel { }
export class ConstrainedStringModel extends ConstrainedMetaModel { }
export class ConstrainedBooleanModel extends ConstrainedMetaModel { }
export class ConstrainedTupleValueModel {
  index: number;
  value: ConstrainedMetaModel;
  constructor(index: number, value: ConstrainedMetaModel) {
    this.index = index;
    this.value = value;
  }
}
export class ConstrainedTupleModel extends ConstrainedMetaModel {
  tupleModels: ConstrainedTupleValueModel[] = [];
}
export class ConstrainedObjectModel extends ConstrainedMetaModel {
  properties: { [key: string]: ConstrainedMetaModel; } = {};
}
export class ConstrainedArrayModel extends ConstrainedMetaModel {
  valueModel: ConstrainedMetaModel;
  constructor(name: string, type: string, valueModel: ConstrainedMetaModel) {
    super(name, type);
    this.valueModel = valueModel;
  }
}
export class ConstrainedUnionModel extends ConstrainedMetaModel {
  unionModels: ConstrainedMetaModel[] = [];
}
export class ConstrainedEnumValueModel {
  key: string;
  value: any;
  constructor(key: string, value: any) {
    this.key = key;
    this.value = value;
  }
}
export class ConstrainedEnumModel extends ConstrainedMetaModel {
  values: ConstrainedEnumValueModel[] = [];
}
export class ConstrainedDictionaryModel extends ConstrainedMetaModel {
  keyModel: ConstrainedMetaModel;
  valueModel: ConstrainedMetaModel;
  serializationType: 'unwrap' | 'normal' = 'normal';

  constructor(name: string, type: string, keyModel: ConstrainedMetaModel, valueModel: ConstrainedMetaModel) {
    super(name, type);
    this.keyModel = keyModel;
    this.valueModel = valueModel;
  }
}