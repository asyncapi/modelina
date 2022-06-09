import { MetaModel } from './MetaModel';

export abstract class ConstrainedMetaModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any, 
    public type: string) {
    super(name, originalInput);
  }
  abstract getNearestDependencies(): ConstrainedMetaModel[]
}

export class ConstrainedReferenceModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public ref: ConstrainedMetaModel) {
    super(name, originalInput, type);
  }
  getNearestDependencies(): ConstrainedMetaModel[] {
    return [];
  }
}
export class ConstrainedAnyModel extends ConstrainedMetaModel {
  getNearestDependencies(): ConstrainedMetaModel[] {
    return [];
  }
}
export class ConstrainedFloatModel extends ConstrainedMetaModel {
  getNearestDependencies(): ConstrainedMetaModel[] {
    return [];
  }
}
export class ConstrainedIntegerModel extends ConstrainedMetaModel {
  getNearestDependencies(): ConstrainedMetaModel[] {
    return [];
  }
}
export class ConstrainedStringModel extends ConstrainedMetaModel {
  getNearestDependencies(): ConstrainedMetaModel[] {
    return [];
  }
}
export class ConstrainedBooleanModel extends ConstrainedMetaModel {
  getNearestDependencies(): ConstrainedMetaModel[] {
    return [];
  }
}
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
  public tuple: ConstrainedTupleValueModel[]) {
    super(name, originalInput, type);
  }
  getNearestDependencies(): ConstrainedMetaModel[] {
    return [];
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
  public properties: { [key: string]: ConstrainedObjectPropertyModel; }) {
    super(name, originalInput, type);
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
}
export class ConstrainedArrayModel extends ConstrainedMetaModel {
  getNearestDependencies(): ConstrainedMetaModel[] {
    if (this.valueModel instanceof ConstrainedReferenceModel &&
      this.valueModel.name !== this.name) {
      return [this.valueModel];
    }
    return [];
  }
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public valueModel: ConstrainedMetaModel) {
    super(name, originalInput, type);
  }
}
export class ConstrainedUnionModel extends ConstrainedMetaModel {
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
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
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
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public values: ConstrainedEnumValueModel[]) {
    super(name, originalInput, type);
  }
}
export class ConstrainedDictionaryModel extends ConstrainedMetaModel {
  getNearestDependencies(): ConstrainedMetaModel[] {
    return [];
  }
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public key: ConstrainedMetaModel, 
    public value: ConstrainedMetaModel, 
    public serializationType: 'unwrap' | 'normal' = 'normal') {
    super(name, originalInput, type);
  }
}
