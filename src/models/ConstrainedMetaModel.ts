/* eslint-disable @typescript-eslint/no-unused-vars */
import { DeepPartial, mergePartialAndDefault } from '../utils';
import { makeUnique } from '../helpers/DependencyHelpers';
import {
  MetaModel,
  MetaModelOptions,
  MetaModelOptionsConst,
  MetaModelOptionsDiscriminator
} from './MetaModel';

export interface ConstrainedMetaModelOptionsConst
  extends MetaModelOptionsConst {
  value?: unknown;
}

export interface ConstrainedMetaModelOptionsDiscriminator
  extends MetaModelOptionsDiscriminator {
  type?: string;
}

export class ConstrainedMetaModelOptions extends MetaModelOptions {
  const?: ConstrainedMetaModelOptionsConst;
  discriminator?: ConstrainedMetaModelOptionsDiscriminator;
  parents?: ConstrainedMetaModel[];
  extend?: ConstrainedMetaModel[];
  implementedBy?: ConstrainedMetaModel[];
}

export interface GetNearestDependenciesArgument {
  alreadyVisitedNodes: any[];
}

const defaultGetNearestDependenciesArgument: GetNearestDependenciesArgument = {
  alreadyVisitedNodes: []
};

export abstract class ConstrainedMetaModel extends MetaModel {
  public options: ConstrainedMetaModelOptions;

  constructor(
    name: string,
    originalInput: any,
    options: ConstrainedMetaModelOptions,
    public type: string
  ) {
    super(name, originalInput, options);
    this.options = {
      ...options
    };

    if (options.const) {
      this.options.const = {
        ...options.const
      };
    }

    if (options.discriminator) {
      this.options.discriminator = {
        ...options.discriminator
      };
    }
  }

  /**
   * Get the nearest constrained meta models for the constrained model.
   *
   * This is often used when you want to know which other models you are referencing.
   */
  getNearestDependencies(
    arg?: DeepPartial<GetNearestDependenciesArgument>
  ): ConstrainedMetaModel[] {
    return [];
  }
}

export class ConstrainedReferenceModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any,
    options: ConstrainedMetaModelOptions,
    type: string,
    public ref: ConstrainedMetaModel
  ) {
    super(name, originalInput, options, type);
  }
}
export class ConstrainedAnyModel extends ConstrainedMetaModel {}
export class ConstrainedFloatModel extends ConstrainedMetaModel {}
export class ConstrainedIntegerModel extends ConstrainedMetaModel {}
export class ConstrainedStringModel extends ConstrainedMetaModel {}
export class ConstrainedBooleanModel extends ConstrainedMetaModel {}
export class ConstrainedTupleValueModel {
  constructor(
    public index: number,
    public value: ConstrainedMetaModel
  ) {}
}
export class ConstrainedTupleModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any,
    options: ConstrainedMetaModelOptions,
    type: string,
    public tuple: ConstrainedTupleValueModel[]
  ) {
    super(name, originalInput, options, type);
  }

  getNearestDependencies(
    arg?: DeepPartial<GetNearestDependenciesArgument>
  ): ConstrainedMetaModel[] {
    const argumentsToUse = mergePartialAndDefault(
      defaultGetNearestDependenciesArgument,
      arg
    ) as GetNearestDependenciesArgument;
    argumentsToUse.alreadyVisitedNodes.push(this);
    let dependencyModels: ConstrainedMetaModel[] = [];
    for (const tupleModel of Object.values(this.tuple)) {
      if (tupleModel.value instanceof ConstrainedReferenceModel) {
        dependencyModels.push(tupleModel.value);
      } else if (
        !argumentsToUse.alreadyVisitedNodes.includes(tupleModel.value)
      ) {
        //Lets check the non-reference model for dependencies
        dependencyModels = [
          ...dependencyModels,
          ...tupleModel.value.getNearestDependencies(argumentsToUse)
        ];
      }
    }

    //Ensure no duplicate references
    dependencyModels = makeUnique(dependencyModels);

    return dependencyModels;
  }
}
export class ConstrainedObjectPropertyModel {
  constructor(
    public propertyName: string,
    public unconstrainedPropertyName: string,
    public required: boolean,
    public property: ConstrainedMetaModel
  ) {}
}
export class ConstrainedArrayModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any,
    options: ConstrainedMetaModelOptions,
    type: string,
    public valueModel: ConstrainedMetaModel
  ) {
    super(name, originalInput, options, type);
  }

  getNearestDependencies(
    arg?: DeepPartial<GetNearestDependenciesArgument>
  ): ConstrainedMetaModel[] {
    const argumentsToUse = mergePartialAndDefault(
      defaultGetNearestDependenciesArgument,
      arg
    ) as GetNearestDependenciesArgument;
    argumentsToUse.alreadyVisitedNodes.push(this);
    if (this.valueModel instanceof ConstrainedReferenceModel) {
      return [this.valueModel];
    } else if (!argumentsToUse.alreadyVisitedNodes.includes(this.valueModel)) {
      return this.valueModel.getNearestDependencies(argumentsToUse);
    }
    return [];
  }
}
export class ConstrainedUnionModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any,
    options: ConstrainedMetaModelOptions,
    type: string,
    public union: ConstrainedMetaModel[],
    public properties: { [key: string]: ConstrainedObjectPropertyModel }
  ) {
    super(name, originalInput, options, type);
  }

  getNearestDependencies(
    arg?: DeepPartial<GetNearestDependenciesArgument>
  ): ConstrainedMetaModel[] {
    const argumentsToUse = mergePartialAndDefault(
      defaultGetNearestDependenciesArgument,
      arg
    ) as GetNearestDependenciesArgument;
    argumentsToUse.alreadyVisitedNodes.push(this);
    let dependencyModels: ConstrainedMetaModel[] = [];
    for (const unionModel of Object.values(this.union)) {
      if (unionModel instanceof ConstrainedReferenceModel) {
        dependencyModels.push(unionModel);
      } else if (!argumentsToUse.alreadyVisitedNodes.includes(unionModel)) {
        //Lets check the non-reference model for dependencies
        dependencyModels = [
          ...dependencyModels,
          ...unionModel.getNearestDependencies(argumentsToUse)
        ];
      }
    }

    //Ensure no duplicate references
    dependencyModels = makeUnique(dependencyModels);

    return dependencyModels;
  }
}
export class ConstrainedEnumValueModel {
  constructor(
    public key: string,
    public value: any,
    public originalInput: unknown
  ) {}
}
export class ConstrainedEnumModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any,
    options: ConstrainedMetaModelOptions,
    type: string,
    public values: ConstrainedEnumValueModel[]
  ) {
    super(name, originalInput, options, type);
  }
}
export class ConstrainedDictionaryModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any,
    options: ConstrainedMetaModelOptions,
    type: string,
    public key: ConstrainedMetaModel,
    public value: ConstrainedMetaModel,
    public serializationType: 'unwrap' | 'normal' = 'normal'
  ) {
    super(name, originalInput, options, type);
  }

  getNearestDependencies(
    arg?: DeepPartial<GetNearestDependenciesArgument>
  ): ConstrainedMetaModel[] {
    const argumentsToUse = mergePartialAndDefault(
      defaultGetNearestDependenciesArgument,
      arg
    ) as GetNearestDependenciesArgument;
    argumentsToUse.alreadyVisitedNodes.push(this);
    const dependencies = [this.key, this.value];
    let dependencyModels: ConstrainedMetaModel[] = [];
    for (const model of dependencies) {
      if (model instanceof ConstrainedReferenceModel) {
        dependencyModels.push(model);
      } else if (!argumentsToUse.alreadyVisitedNodes.includes(model)) {
        //Lets check the non-reference model for dependencies
        dependencyModels = [
          ...dependencyModels,
          ...model.getNearestDependencies(argumentsToUse)
        ];
      }
    }

    //Ensure no duplicate references
    dependencyModels = makeUnique(dependencyModels);

    return dependencyModels;
  }
}

export class ConstrainedObjectModel extends ConstrainedMetaModel {
  constructor(
    name: string,
    originalInput: any,
    options: ConstrainedMetaModelOptions,
    type: string,
    public properties: { [key: string]: ConstrainedObjectPropertyModel }
  ) {
    super(name, originalInput, options, type);
  }

  getNearestDependencies(
    arg?: DeepPartial<GetNearestDependenciesArgument>
  ): ConstrainedMetaModel[] {
    const argumentsToUse = mergePartialAndDefault(
      defaultGetNearestDependenciesArgument,
      arg
    ) as GetNearestDependenciesArgument;
    argumentsToUse.alreadyVisitedNodes.push(this);
    let dependencyModels: ConstrainedMetaModel[] = [];
    for (const modelProperty of Object.values(this.properties)) {
      if (modelProperty.property instanceof ConstrainedReferenceModel) {
        dependencyModels.push(modelProperty.property);
      } else if (
        !argumentsToUse.alreadyVisitedNodes.includes(modelProperty.property)
      ) {
        //Lets check the non-reference model for dependencies
        dependencyModels = [
          ...dependencyModels,
          ...modelProperty.property.getNearestDependencies(argumentsToUse)
        ];
      }
    }

    //Ensure no self references
    dependencyModels = dependencyModels.filter((referenceModel) => {
      return referenceModel.name !== this.name;
    });

    //Ensure no duplicate references
    dependencyModels = makeUnique(dependencyModels);

    return dependencyModels;
  }

  /**
   * More specifics on the type setup here: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-cant-i-write-typeof-t-new-t-or-instanceof-t-in-my-generic-function
   *
   * @param propertyType
   */
  containsPropertyType<T>(propertyType: { new (...args: any[]): T }): boolean {
    const foundPropertiesWithType = Object.values(this.properties).filter(
      (property) => {
        return property.property instanceof propertyType;
      }
    );
    return foundPropertiesWithType.length !== 0;
  }
}
