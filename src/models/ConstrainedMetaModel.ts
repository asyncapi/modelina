import { MetaModel } from './MetaModel';

export abstract class ConstrainedMetaModel extends MetaModel {
  constructor(
    name: string,
    originalInput: any, 
    public type: string) {
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

export class ConstrainedReferenceModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
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
    name: string,
    originalInput: any, 
    type: string, 
    public tuple: ConstrainedTupleValueModel[]) {
    super(name, originalInput, type);
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
    public unconstrainedPropertyName: string,
    public required: boolean,
    public property: ConstrainedMetaModel) {
  }
}
export class ConstrainedArrayModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public valueModel: ConstrainedMetaModel) {
    super(name, originalInput, type);
  }

  getNearestDependencies(): ConstrainedMetaModel[] {
    if (this.valueModel instanceof ConstrainedReferenceModel &&
      this.valueModel.name !== this.name) {
      return [this.valueModel];
    }
    return [];
  }
}
export class ConstrainedUnionModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public union: ConstrainedMetaModel[]) {
    super(name, originalInput, type);
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
export class ConstrainedEnumModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public values: ConstrainedEnumValueModel[]) {
    super(name, originalInput, type);
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
export class ConstrainedDictionaryModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any, 
    type: string, 
    public key: ConstrainedMetaModel, 
    public value: ConstrainedMetaModel, 
    public serializationType: 'unwrap' | 'normal' = 'normal') {
    super(name, originalInput, type);
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
  
  /**
   * More specifics on the type setup here: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-cant-i-write-typeof-t-new-t-or-instanceof-t-in-my-generic-function
   *  
   * @param propertyType 
   * @returns 
   */
  containsPropertyType<T>(propertyType: { new(...args: any[]): T }) : boolean {
    const foundPropertiesWithType = Object.values(this.properties).filter((property) => {
      return property.property instanceof propertyType;
    });
    return foundPropertiesWithType.length !== 0;
  }
}
