import { AnyModel, ArrayModel, BooleanModel, DictionaryModel, EnumModel, FloatModel, IntegerModel, MetaModel, ObjectModel, ObjectPropertyModel, ReferenceModel, StringModel, TupleModel, UnionModel } from './MetaModel';

export abstract class ConstrainedMetaModel<RawMetaModel extends MetaModel = MetaModel> extends MetaModel {
  constructor(
    name: string,
    originalInput: any, 
    public type: string, 
    public rawMetaModel: RawMetaModel) {
    super(name, originalInput);
  }

  /**
   * Get the nearest constrained meta models for the constrained model.
   * 
   * This is often used when you want to know which other models you are referencing.
   */
  getNearestDependencies(): ConstrainedMetaModel[] {
    return [];
  }
}

export class ConstrainedReferenceModel extends ConstrainedMetaModel<ReferenceModel> {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    rawMetaModel: ReferenceModel, 
    public ref: ConstrainedMetaModel) {
    super(name, originalInput, type, rawMetaModel);
  }
}
export class ConstrainedAnyModel extends ConstrainedMetaModel<AnyModel> { }
export class ConstrainedFloatModel extends ConstrainedMetaModel<FloatModel> { }
export class ConstrainedIntegerModel extends ConstrainedMetaModel<IntegerModel> { }
export class ConstrainedStringModel extends ConstrainedMetaModel<StringModel> { }
export class ConstrainedBooleanModel extends ConstrainedMetaModel<BooleanModel> { }
export class ConstrainedTupleValueModel {
  constructor(
    public index: number, 
    public value: ConstrainedMetaModel) {
  }
}
export class ConstrainedTupleModel extends ConstrainedMetaModel<TupleModel> {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    rawMetaModel: TupleModel, 
    public tuple: ConstrainedTupleValueModel[]) {
    super(name, originalInput, type, rawMetaModel);
  }

  getNearestDependencies(): ConstrainedMetaModel[] {
    let dependencyModels = Object.values(this.tuple).filter(
      (tupleModel) => {
        return tupleModel.value instanceof ConstrainedReferenceModel;
      }
    ).map((tupleModel) => {
      return tupleModel.value = tupleModel.value as ConstrainedReferenceModel;
    });
    //Ensure no self references
    dependencyModels = dependencyModels.filter((referenceModel) => {
      return referenceModel.name !== this.name;
    });
    return dependencyModels;
  }
}
export class ConstrainedObjectPropertyModel {
  constructor(
    public propertyName: string,
    public required: boolean,
    public property: ConstrainedMetaModel,
    public rawMetaModel: ObjectPropertyModel) {
  }
}
export class ConstrainedArrayModel extends ConstrainedMetaModel<ArrayModel> {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    rawMetaModel: ArrayModel, 
    public valueModel: ConstrainedMetaModel) {
    super(name, originalInput, type, rawMetaModel);
  }

  getNearestDependencies(): ConstrainedMetaModel[] {
    if (this.valueModel instanceof ConstrainedReferenceModel &&
      this.valueModel.name !== this.name) {
      return [this.valueModel];
    }
    return [];
  }
}
export class ConstrainedUnionModel extends ConstrainedMetaModel<UnionModel> {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    rawMetaModel: UnionModel, 
    public union: ConstrainedMetaModel[]) {
    super(name, originalInput, type, rawMetaModel);
  }

  getNearestDependencies(): ConstrainedReferenceModel[] {
    let dependencyModels = Object.values(this.union).filter(
      (unionModel) => {
        return unionModel instanceof ConstrainedReferenceModel;
      }
    ).map((unionModel) => {
      return unionModel as ConstrainedReferenceModel;
    });
    //Ensure no self references
    dependencyModels = dependencyModels.filter((referenceModel) => {
      return referenceModel.name !== this.name;
    });
    return dependencyModels;
  }
}
export class ConstrainedEnumValueModel {
  constructor(
    public key: string, 
    public value: any) {
  }
}
export class ConstrainedEnumModel extends ConstrainedMetaModel<EnumModel> {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    rawMetaModel: EnumModel, 
    public values: ConstrainedEnumValueModel[]) {
    super(name, originalInput, type, rawMetaModel);
  }

  getNearestDependencies(): ConstrainedReferenceModel[] {
    let dependencyModels = Object.values(this.values).filter(
      (enumModel) => {
        return enumModel.value instanceof ConstrainedReferenceModel;
      }
    ).map((enumModel) => {
      return enumModel.value as ConstrainedReferenceModel;
    });
    //Ensure no self references
    dependencyModels = dependencyModels.filter((referenceModel) => {
      return referenceModel.name !== this.name;
    });
    return dependencyModels;
  }
}
export class ConstrainedDictionaryModel extends ConstrainedMetaModel<DictionaryModel> {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    rawMetaModel: DictionaryModel, 
    public key: ConstrainedMetaModel, 
    public value: ConstrainedMetaModel, 
    public serializationType: 'unwrap' | 'normal' = 'normal') {
    super(name, originalInput, type, rawMetaModel);
  }

  getNearestDependencies(): ConstrainedMetaModel[] {
    const dependencies = [this.key, this.value];
    let dependencyModels = dependencies.filter(
      (model) => {
        return model instanceof ConstrainedReferenceModel;
      }
    ).map((model) => {
      return model as ConstrainedReferenceModel;
    });
    //Ensure no self references
    dependencyModels = dependencyModels.filter((referenceModel) => {
      return referenceModel.name !== this.name;
    });
    return dependencyModels;
  }
}

export class ConstrainedObjectModel extends ConstrainedMetaModel<ObjectModel> {
  constructor(
    name: string,
    originalInput: any, 
    type: string,
    rawMetaModel: ObjectModel,
    public properties: { [key: string]: ConstrainedObjectPropertyModel; }) {
    super(name, originalInput, type, rawMetaModel);
  }

  getNearestDependencies(): ConstrainedReferenceModel[] {
    let dependencyModels = Object.values(this.properties).filter(
      (modelProperty) => {
        return modelProperty.property instanceof ConstrainedReferenceModel;
      }
    ).map((modelProperty) => {
      return modelProperty.property as ConstrainedReferenceModel;
    });
    //Ensure no self references
    dependencyModels = dependencyModels.filter((referenceModel) => {
      return referenceModel.name !== this.name;
    });
    return dependencyModels;
  }
  
  /**
   * More specifics on the type setup here: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-cant-i-write-typeof-t-new-t-or-instanceof-t-in-my-generic-function
   *  
   * @param propertyType 
   * @returns 
   */
  containsPropertyType<T>(propertyType: { new(...args: any[]): T }) : boolean {
    const foundPropertiesWithType = Object.values(this.properties).filter((property) => {
      return property instanceof propertyType;
    });
    return foundPropertiesWithType.length === 0;
  }
}
