import { Logger } from '../utils';

export interface MergingOptions {
  /**
   * When models are merged, should merging models constrict the `merging to` model?
   * If false, `required` keyword would no longer be applied from the `merging from` model.
   */
  constrictModels?: boolean;
}
export const defaultMergingOptions: MergingOptions = {
  constrictModels: true
};

/**
 * Common internal representation for a model.
 */
export class CommonModel {
  extend?: string[];
  originalInput?: any;
  $id?: string;
  type?: string | string[];
  enum?: any[];
  const?: unknown;
  discriminator?: string;
  items?: CommonModel | CommonModel[];
  properties?: { [key: string]: CommonModel };
  additionalProperties?: CommonModel;
  patternProperties?: { [key: string]: CommonModel };
  required?: string[];
  additionalItems?: CommonModel;
  union?: CommonModel[];
  propertyIsRequired?: boolean;
  format?: string;

  /**
   * Takes a deep copy of the input object and converts it to an instance of CommonModel.
   *
   * @param object to transform
   * @returns CommonModel instance of the object
   */
  static toCommonModel(
    object: Record<string, unknown> | CommonModel
  ): CommonModel {
    const convertedSchema = CommonModel.internalToSchema(object);
    if (convertedSchema instanceof CommonModel) {
      return convertedSchema;
    }
    throw new Error('Could not convert input to expected copy of CommonModel');
  }
  private static internalToSchema(
    object: any,
    seenSchemas: Map<any, CommonModel> = new Map()
  ): any {
    // if primitive types return as is
    if (null === object || 'object' !== typeof object) {
      return object;
    }

    if (seenSchemas.has(object)) {
      return seenSchemas.get(object);
    }

    if (object instanceof Array) {
      const copy: any = [];
      for (let i = 0, len = object.length; i < len; i++) {
        copy[Number(i)] = CommonModel.internalToSchema(
          object[Number(i)],
          seenSchemas
        );
      }
      return copy;
    }
    //Nothing else left then to create an object
    const schema = new CommonModel();
    seenSchemas.set(object, schema);
    for (const [propName, prop] of Object.entries(object)) {
      let copyProp = prop;

      // Ignore value properties (those with `any` type) as they should be saved as is regardless of value
      if (propName !== 'originalInput' && propName !== 'enum') {
        copyProp = CommonModel.internalToSchema(prop, seenSchemas);
      }
      (schema as any)[String(propName)] = copyProp;
    }
    return schema;
  }

  /**
   * Retrieves data from originalInput by given key
   *
   * @param key given key
   * @returns {any}
   */
  getFromOriginalInput<K extends keyof any>(key: K): any {
    const input = this.originalInput || {};
    if (typeof input === 'boolean') {
      return undefined;
    }
    return input[String(key)];
  }

  /**
   * Set the types of the model
   *
   * @param type
   */
  setType(type: string | string[] | undefined): void {
    if (Array.isArray(type)) {
      if (type.length === 0) {
        this.type = undefined;
        return;
      } else if (type.length === 1) {
        this.type = type[0];
        return;
      }
    }
    this.type = type;
  }

  /**
   * Removes type(s) from model type
   *
   * @param types
   */
  removeType(typesToRemove: string | string[]): void {
    if (Array.isArray(typesToRemove)) {
      for (const type of typesToRemove) {
        this.removeType(type);
      }
    } else if (this.type !== undefined && this.type.includes(typesToRemove)) {
      if (Array.isArray(this.type)) {
        this.setType(
          this.type.filter((el) => {
            return el !== typesToRemove;
          })
        );
      } else {
        this.setType(undefined);
      }
    }
  }

  /**
   * Adds types to the existing model types.
   *
   * Makes sure to only keep a single type incase of duplicates.
   *
   * @param types which types we should try and add to the existing output
   */
  addTypes(types: string[] | string): void {
    if (Array.isArray(types)) {
      for (const type of types) {
        this.addTypes(type);
      }
    } else if (this.type === undefined) {
      this.type = types;
    } else if (!Array.isArray(this.type) && this.type !== types) {
      this.type = [this.type, types];
    } else if (Array.isArray(this.type) && !this.type.includes(types)) {
      this.type.push(types);
    }
  }

  /**
   * Checks if given property name is required in object
   *
   * @param propertyName given property name
   * @returns {boolean}
   */
  isRequired(propertyName: string): boolean {
    if (this.required === undefined) {
      return false;
    }
    return this.required.includes(propertyName);
  }

  /**
   * Adds an item to the model.
   *
   * If items already exist the two are merged.
   *
   * @param itemModel
   * @param originalInput corresponding input that got interpreted to this model
   */
  addItem(itemModel: CommonModel, originalInput: any): void {
    if (this.items !== undefined) {
      Logger.warn(
        `While trying to add item to model ${this.$id}, duplicate items found. Merging models together to form a unified item model.`,
        itemModel,
        originalInput,
        this
      );
      this.items = CommonModel.mergeCommonModels(
        this.items as CommonModel,
        itemModel,
        originalInput
      );
    } else {
      this.items = itemModel;
    }
  }

  /**
   * Adds a tuple to the model.
   *
   * If a item already exist it will be merged.
   *
   * @param tupleModel
   * @param originalInput corresponding input that got interpreted to this model
   * @param index
   */
  addItemTuple(
    tupleModel: CommonModel,
    originalInput: any,
    index: number
  ): void {
    let modelItems = this.items;
    if (!Array.isArray(modelItems)) {
      Logger.warn(
        'Trying to add item tuple to a non-tuple item, will drop existing item model',
        tupleModel,
        originalInput,
        index
      );
      modelItems = [];
    }
    const existingModelAtIndex = modelItems[Number(index)];
    if (existingModelAtIndex !== undefined) {
      Logger.warn(
        'Trying to add item tuple at index ${index} but it was already occupied, merging models',
        tupleModel,
        originalInput,
        index
      );
      modelItems[Number(index)] = CommonModel.mergeCommonModels(
        existingModelAtIndex,
        tupleModel,
        originalInput
      );
    } else {
      modelItems[Number(index)] = tupleModel;
    }
    this.items = modelItems;
  }

  /**
   * Adds a union model to the model.
   *
   * @param unionModel
   */
  addItemUnion(unionModel: CommonModel): void {
    if (Array.isArray(this.union)) {
      this.union.push(unionModel);
    } else {
      this.union = [unionModel];
    }
  }

  /**
   * Add enum value to the model.
   *
   * Ensures no duplicates are added.
   *
   * @param enumValue
   */
  addEnum(enumValue: any): void {
    if (this.enum === undefined) {
      this.enum = [];
    }
    if (!this.enum.includes(enumValue)) {
      this.enum.push(enumValue);
    }
  }

  /**
   * Remove enum from model.
   *
   * @param enumValue
   */
  removeEnum(enumsToRemove: any | any[]): void {
    if (this.enum === undefined || enumsToRemove === undefined) {
      return;
    }
    if (Array.isArray(enumsToRemove)) {
      for (const enumToRemove of enumsToRemove) {
        this.removeEnum(enumToRemove);
      }
      return;
    }
    const filteredEnums = this.enum.filter((el) => {
      return enumsToRemove !== el;
    });
    if (filteredEnums.length === 0) {
      this.enum = undefined;
    } else {
      this.enum = filteredEnums;
    }
  }

  /**
   * Adds a property to the model.
   * If the property already exist the two are merged.
   *
   * @param propertyName
   * @param propertyModel
   * @param originalInput corresponding input that got interpreted to this model
   */
  addProperty(
    propertyName: string,
    propertyModel: CommonModel,
    originalInput: any
  ): void {
    if (this.properties === undefined) {
      this.properties = {};
    }
    if (this.properties[`${propertyName}`] !== undefined) {
      Logger.warn(
        `While trying to add property to model, duplicate properties found. Merging models together for property ${propertyName}`,
        propertyModel,
        originalInput,
        this
      );
      this.properties[String(propertyName)] = CommonModel.mergeCommonModels(
        this.properties[String(propertyName)],
        propertyModel,
        originalInput
      );
    } else {
      this.properties[String(propertyName)] = propertyModel;
    }
  }

  /**
   * Adds additionalProperty to the model.
   * If another model already exist the two are merged.
   *
   * @param additionalPropertiesModel
   * @param originalInput corresponding input that got interpreted to this model corresponding input that got interpreted to this model
   */
  addAdditionalProperty(
    additionalPropertiesModel: CommonModel,
    originalInput: any
  ): void {
    if (this.additionalProperties !== undefined) {
      Logger.warn(
        'While trying to add additionalProperties to model, but it is already present, merging models together',
        additionalPropertiesModel,
        originalInput,
        this
      );
      this.additionalProperties = CommonModel.mergeCommonModels(
        this.additionalProperties,
        additionalPropertiesModel,
        originalInput
      );
    } else {
      this.additionalProperties = additionalPropertiesModel;
    }
  }

  /**
   * Adds a patternProperty to the model.
   * If the pattern already exist the two models are merged.
   *
   * @param pattern
   * @param patternModel
   * @param originalInput corresponding input that got interpreted to this model
   */
  addPatternProperty(
    pattern: string,
    patternModel: CommonModel,
    originalInput: any
  ): void {
    if (this.patternProperties === undefined) {
      this.patternProperties = {};
    }
    if (this.patternProperties[`${pattern}`] !== undefined) {
      Logger.warn(
        `While trying to add patternProperty to model, duplicate patterns found. Merging pattern models together for pattern ${pattern}`,
        patternModel,
        originalInput,
        this
      );
      this.patternProperties[String(pattern)] = CommonModel.mergeCommonModels(
        this.patternProperties[String(pattern)],
        patternModel,
        originalInput
      );
    } else {
      this.patternProperties[String(pattern)] = patternModel;
    }
  }

  /**
   * Adds additionalItems to the model.
   * If another model already exist the two are merged.
   *
   * @param additionalItemsModel
   * @param originalInput corresponding input that got interpreted to this model
   */
  addAdditionalItems(
    additionalItemsModel: CommonModel,
    originalInput: any
  ): void {
    if (this.additionalItems !== undefined) {
      Logger.warn(
        'While trying to add additionalItems to model, but it is already present, merging models together',
        additionalItemsModel,
        originalInput,
        this
      );
      this.additionalItems = CommonModel.mergeCommonModels(
        this.additionalItems,
        additionalItemsModel,
        originalInput
      );
    } else {
      this.additionalItems = additionalItemsModel;
    }
  }

  /**
   * Adds another model this model should extend.
   *
   * It is only allowed to extend if the other model have $id and is not already being extended.
   *
   * @param extendedModel
   */
  addExtendedModel(extendedModel: CommonModel): void {
    if (extendedModel.$id === undefined) {
      Logger.error(
        'Found no $id for allOf model and cannot extend the existing model, this should never happen.',
        this,
        extendedModel
      );
      return;
    }
    this.extend = this.extend || [];
    if (this.extend.includes(extendedModel.$id)) {
      Logger.info(
        `${this.$id} model already extends model ${extendedModel.$id}.`,
        this,
        extendedModel
      );
      return;
    }
    this.extend.push(extendedModel.$id);
  }

  /**
   * Returns true if the $id of a CommonModel includes anonymous_schema
   *
   * @param commonModel
   */
  private static idIncludesAnonymousSchema(commonModel: CommonModel) {
    return commonModel.$id?.includes('anonymous_schema');
  }

  /**
   * Merge two common model properties together
   *
   * @param mergeTo
   * @param mergeFrom
   * @param originalInput corresponding input that got interpreted to this model
   * @param alreadyIteratedModels
   */
  private static mergeProperties(
    mergeTo: CommonModel,
    mergeFrom: CommonModel,
    originalInput: any,
    alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map(),
    options: MergingOptions = defaultMergingOptions
  ) {
    if (!mergeTo.properties) {
      mergeTo.properties = mergeFrom.properties;
      return;
    }

    if (!mergeFrom.properties) {
      return;
    }

    mergeTo.properties = {
      ...mergeTo.properties
    };

    for (const [propName, propValue] of Object.entries(mergeFrom.properties)) {
      if (!mergeTo.properties[String(propName)]) {
        mergeTo.properties[String(propName)] = propValue;
      } else {
        Logger.warn(
          `Found duplicate properties ${propName} for model. Model property from ${
            mergeFrom.$id || 'unknown'
          } merged into ${mergeTo.$id || 'unknown'}`,
          mergeTo,
          mergeFrom,
          originalInput
        );

        // takes a deep copy of the mergeTo model if the id of mergeTo is anonymous to avoid carrying over properties to other models
        const mergeToModel = CommonModel.idIncludesAnonymousSchema(
          mergeTo.properties[String(propName)]
        )
          ? CommonModel.toCommonModel(mergeTo.properties[String(propName)])
          : mergeTo.properties[String(propName)];

        const mergedModel = CommonModel.mergeCommonModels(
          mergeToModel,
          propValue,
          originalInput,
          alreadyIteratedModels,
          options
        );

        if (propValue.const) {
          mergeTo.properties[String(propName)] =
            CommonModel.toCommonModel(mergedModel);
          mergeTo.properties[String(propName)].const = propValue.const;
        } else {
          mergeTo.properties[String(propName)] = mergedModel;
        }
      }
    }
  }
  /**
   * Merge two common model additionalProperties together
   *
   * @param mergeTo
   * @param mergeFrom
   * @param originalInput corresponding input that got interpreted to this model
   * @param alreadyIteratedModels
   */
  private static mergeAdditionalProperties(
    mergeTo: CommonModel,
    mergeFrom: CommonModel,
    originalInput: any,
    alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map(),
    options: MergingOptions = defaultMergingOptions
  ) {
    const mergeToAdditionalProperties = mergeTo.additionalProperties;
    const mergeFromAdditionalProperties = mergeFrom.additionalProperties;
    if (mergeFromAdditionalProperties !== undefined) {
      if (mergeToAdditionalProperties === undefined) {
        mergeTo.additionalProperties = mergeFromAdditionalProperties;
      } else {
        Logger.warn(
          `Found duplicate additionalProperties for model. additionalProperties from ${
            mergeFrom.$id || 'unknown'
          } merged into ${mergeTo.$id || 'unknown'}`,
          mergeTo,
          mergeFrom,
          originalInput
        );
        mergeTo.additionalProperties = CommonModel.mergeCommonModels(
          mergeToAdditionalProperties,
          mergeFromAdditionalProperties,
          originalInput,
          alreadyIteratedModels,
          options
        );
      }
    }
  }

  /**
   * Merge two common model additionalItems together
   *
   * @param mergeTo
   * @param mergeFrom
   * @param originalInput corresponding input that got interpreted to this model
   * @param alreadyIteratedModels
   */
  private static mergeAdditionalItems(
    mergeTo: CommonModel,
    mergeFrom: CommonModel,
    originalInput: any,
    alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map(),
    options: MergingOptions = defaultMergingOptions
  ) {
    const mergeToAdditionalItems = mergeTo.additionalItems;
    const mergeFromAdditionalItems = mergeFrom.additionalItems;
    if (mergeFromAdditionalItems !== undefined) {
      if (mergeToAdditionalItems === undefined) {
        mergeTo.additionalItems = mergeFromAdditionalItems;
      } else {
        Logger.warn(
          `Found duplicate additionalItems for model. additionalItems from ${
            mergeFrom.$id || 'unknown'
          } merged into ${mergeTo.$id || 'unknown'}`,
          mergeTo,
          mergeFrom,
          originalInput
        );
        mergeTo.additionalItems = CommonModel.mergeCommonModels(
          mergeToAdditionalItems,
          mergeFromAdditionalItems,
          originalInput,
          alreadyIteratedModels,
          options
        );
      }
    }
  }

  /**
   * Merge items together, prefer tuples over simple array since it is more strict.
   *
   * @param mergeTo
   * @param mergeFrom
   * @param originalInput corresponding input that got interpreted to this model
   * @param alreadyIteratedModels
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  private static mergeItems(
    mergeTo: CommonModel,
    mergeFrom: CommonModel,
    originalInput: any,
    alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map(),
    options: MergingOptions = defaultMergingOptions
  ) {
    if (mergeFrom.items === undefined) {
      return;
    }
    if (Array.isArray(mergeFrom.items) && mergeFrom.items.length === 0) {
      return;
    }
    if (mergeTo.items === undefined) {
      mergeTo.items = mergeFrom.items;
      return;
    }
    const mergeToItems = mergeTo.items;

    //mergeFrom and mergeTo is not tuple
    if (!Array.isArray(mergeFrom.items) && !Array.isArray(mergeToItems)) {
      mergeTo.items = CommonModel.mergeCommonModels(
        mergeToItems,
        mergeFrom.items,
        originalInput,
        alreadyIteratedModels,
        options
      );
    }

    //mergeFrom and mergeTo is tuple
    if (Array.isArray(mergeFrom.items) && Array.isArray(mergeToItems)) {
      for (const [index, mergeFromTupleModel] of mergeFrom.items.entries()) {
        (mergeTo.items as CommonModel[])[Number(index)] =
          CommonModel.mergeCommonModels(
            mergeToItems[Number(index)],
            mergeFromTupleModel,
            originalInput,
            alreadyIteratedModels,
            options
          );
      }
    }

    //mergeFrom is a tuple && mergeTo is not, use mergeFrom items (the tuple is prioritized)
    if (Array.isArray(mergeFrom.items) && !Array.isArray(mergeToItems)) {
      mergeTo.items = mergeFrom.items;
    }
    //mergeFrom is not tuple && mergeTo is, do nothing
  }

  /**
   * Merge two common model pattern properties together
   *
   * @param mergeTo
   * @param mergeFrom
   * @param originalInput corresponding input that got interpreted to this model
   * @param alreadyIteratedModels
   */
  private static mergePatternProperties(
    mergeTo: CommonModel,
    mergeFrom: CommonModel,
    originalInput: any,
    alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map(),
    options: MergingOptions = defaultMergingOptions
  ) {
    const mergeToPatternProperties = mergeTo.patternProperties;
    const mergeFromPatternProperties = mergeFrom.patternProperties;
    if (mergeFromPatternProperties !== undefined) {
      if (mergeToPatternProperties === undefined) {
        mergeTo.patternProperties = mergeFromPatternProperties;
      } else {
        for (const [pattern, patternModel] of Object.entries(
          mergeFromPatternProperties
        )) {
          if (mergeToPatternProperties[String(pattern)] !== undefined) {
            Logger.warn(
              `Found duplicate pattern ${pattern} for model. Model pattern for ${
                mergeFrom.$id || 'unknown'
              } merged into ${mergeTo.$id || 'unknown'}`,
              mergeTo,
              mergeFrom,
              originalInput
            );
            mergeToPatternProperties[String(pattern)] =
              CommonModel.mergeCommonModels(
                mergeToPatternProperties[String(pattern)],
                patternModel,
                originalInput,
                alreadyIteratedModels,
                options
              );
          } else {
            mergeToPatternProperties[String(pattern)] = patternModel;
          }
        }
      }
    }
  }

  /**
   * Merge types together
   *
   * @param mergeTo
   * @param mergeFrom
   */
  private static mergeTypes(mergeTo: CommonModel, mergeFrom: CommonModel) {
    //Only add the types that do not already exist
    const addToType = (type: string) => {
      if (mergeTo.type !== undefined && !mergeTo.type.includes(type)) {
        if (Array.isArray(mergeTo.type)) {
          mergeTo.type.push(type);
        } else {
          mergeTo.type = [mergeTo.type, type];
        }
      }
    };
    if (mergeFrom.type !== undefined) {
      if (mergeTo.type === undefined) {
        mergeTo.type = mergeFrom.type;
      } else if (Array.isArray(mergeFrom.type)) {
        for (const type of mergeFrom.type) {
          addToType(type);
        }
      } else {
        addToType(mergeFrom.type);
      }
    }
  }

  /**
   * Only merge if left side is undefined and right side is sat OR both sides are defined
   *
   * @param mergeTo
   * @param mergeFrom
   * @param originalInput corresponding input that got interpreted to this model
   * @param alreadyIteratedModels
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  static mergeCommonModels(
    mergeTo: CommonModel | undefined,
    mergeFrom: CommonModel,
    originalInput: any,
    alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map(),
    options: MergingOptions = defaultMergingOptions
  ): CommonModel {
    if (mergeTo === undefined) {
      return mergeFrom;
    }
    Logger.debug(
      `Merging model ${mergeFrom.$id || 'unknown'} into ${
        mergeTo.$id || 'unknown'
      }`,
      mergeTo,
      mergeFrom,
      originalInput
    );
    if (alreadyIteratedModels.has(mergeFrom)) {
      return alreadyIteratedModels.get(mergeFrom) as CommonModel;
    }
    alreadyIteratedModels.set(mergeFrom, mergeTo);

    CommonModel.mergeAdditionalProperties(
      mergeTo,
      mergeFrom,
      originalInput,
      alreadyIteratedModels,
      options
    );
    CommonModel.mergePatternProperties(
      mergeTo,
      mergeFrom,
      originalInput,
      alreadyIteratedModels,
      options
    );
    CommonModel.mergeAdditionalItems(
      mergeTo,
      mergeFrom,
      originalInput,
      alreadyIteratedModels,
      options
    );
    CommonModel.mergeProperties(
      mergeTo,
      mergeFrom,
      originalInput,
      alreadyIteratedModels,
      options
    );
    CommonModel.mergeItems(
      mergeTo,
      mergeFrom,
      originalInput,
      alreadyIteratedModels,
      options
    );
    CommonModel.mergeTypes(mergeTo, mergeFrom);

    if (mergeFrom.enum !== undefined) {
      mergeTo.enum = [...new Set([...(mergeTo.enum || []), ...mergeFrom.enum])];
    }

    mergeTo.const = mergeTo.const || mergeFrom.const;

    if (mergeFrom.required !== undefined && options.constrictModels === true) {
      mergeTo.required = [
        ...new Set([...(mergeTo.required || []), ...mergeFrom.required])
      ];
    }

    mergeTo.propertyIsRequired =
      mergeTo.propertyIsRequired || mergeFrom.propertyIsRequired;

    mergeTo.format = mergeTo.format || mergeFrom.format;

    if (
      CommonModel.idIncludesAnonymousSchema(mergeTo) &&
      !CommonModel.idIncludesAnonymousSchema(mergeFrom)
    ) {
      mergeTo.$id = mergeFrom.$id;
    } else {
      mergeTo.$id = mergeTo.$id || mergeFrom.$id;
    }
    mergeTo.extend = mergeTo.extend || mergeFrom.extend;
    mergeTo.originalInput = originalInput;
    return mergeTo;
  }
}
