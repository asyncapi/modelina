import { Logger } from '../utils';
import { CommonSchema } from './CommonSchema';
import { Schema } from './Schema';

/**
 * Common internal representation for a model.
 * 
 * @extends CommonSchema<CommonModel>
 * @property {string} $id define the id/name of the model.
 * @property {string | string[]} type this is the different types for the model. All types from JSON Schema are used with no custom ones added.
 * @property {any[]} enum defines the different enums for the model, constant values are included here
 * @property {CommonModel | CommonModel[]} items defines the type for `array` models as `CommonModel`.
 * @property {Record<string, CommonModel>} properties defines the properties and its expected types as `CommonModel`.
 * @property {CommonModel} additionalProperties are used to define if any extra properties are allowed, also defined as a  `CommonModel`.
 * @property {Record<string, CommonModel>} patternProperties are used for any extra properties that matches a specific pattern to be of specific type.
 * @property {string} $ref is a reference to another `CommonModel` by using`$id` as a simple string.
 * @property {string[]} required list of required properties.
 * @property {string[]} extend list of other `CommonModel`s this model extends, is an array of `$id` strings.
 * @property {Schema | boolean} originalSchema the actual input for which this model represent.
 */
export class CommonModel extends CommonSchema<CommonModel> {
  extend?: string[];
  originalSchema?: Schema | boolean;
  
  /**
   * Retrieves data from originalSchema by given key
   * 
   * @param key given key
   * @returns {any}
   */
  getFromSchema<K extends keyof Schema>(key: K): any {
    const schema = this.originalSchema || {};
    if (typeof schema === 'boolean') {return undefined;}
    return schema[String(key)];
  }

  /**
   * Set the types of the model
   * 
   * @param type
   */
  setType(type : string | string[] | undefined): void {
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
  removeType(typesToRemove : string | string[]): void {
    if (Array.isArray(typesToRemove)) {
      for (const type of typesToRemove) {
        this.removeType(type);
      }
    } else if (this.type !== undefined && this.type.includes(typesToRemove)) {
      if (Array.isArray(this.type)) {
        this.setType(this.type.filter((el) => {
          return el !== typesToRemove;
        }));
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
   * @param schema 
   * @param addAsArray
   */
  addItem(itemModel: CommonModel, schema: Schema): void {
    if (this.items !== undefined) {
      Logger.warn(`While trying to add item to model ${this.$id}, duplicate items found. Merging models together to form a unified item model.`, itemModel, schema, this);
      this.items = CommonModel.mergeCommonModels(this.items as CommonModel, itemModel, schema);
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
   * @param schema 
   * @param index 
   */
  addItemTuple(tupleModel: CommonModel, schema: Schema, index: number): void {
    let modelItems = this.items;
    if (!Array.isArray(modelItems)) {
      Logger.warn('Trying to add item tuple to a non-tuple item, will drop existing item model', tupleModel, schema, index);
      modelItems = [];
    }
    const existingModelAtIndex = modelItems[Number(index)];
    if (existingModelAtIndex !== undefined) {
      Logger.warn('Trying to add item tuple at index ${index} but it was already occupied, merging models', tupleModel, schema, index);
      modelItems[Number(index)] = CommonModel.mergeCommonModels(existingModelAtIndex, tupleModel, schema);
    } else {
      modelItems[Number(index)] = tupleModel;
    }
    this.items = modelItems;
  }

  /**
   * Add enum value to the model.
   * 
   * Ensures no duplicates are added.
   * 
   * @param enumValue 
   */
  addEnum(enumValue: any): void {
    if (this.enum === undefined) {this.enum = [];}
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
    if (this.enum === undefined || enumsToRemove === undefined) {return;}
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
   * @param schema schema to the corresponding property model
   */
  addProperty(propertyName: string, propertyModel: CommonModel, schema: Schema): void {
    if (this.properties === undefined) {this.properties = {};}
    if (this.properties[`${propertyName}`] !== undefined) {
      Logger.warn(`While trying to add property to model, duplicate properties found. Merging models together for property ${propertyName}`, propertyModel, schema, this);
      this.properties[String(propertyName)] = CommonModel.mergeCommonModels(this.properties[String(propertyName)], propertyModel, schema);
    } else {
      this.properties[String(propertyName)] = propertyModel;
    }
  }

  /**
   * Adds additionalProperty to the model.
   * If another model already exist the two are merged.
   * 
   * @param additionalPropertiesModel 
   * @param schema 
   */
  addAdditionalProperty(additionalPropertiesModel: CommonModel, schema: Schema): void {
    if (this.additionalProperties !== undefined) {
      Logger.warn('While trying to add additionalProperties to model, but it is already present, merging models together', additionalPropertiesModel, schema, this);
      this.additionalProperties = CommonModel.mergeCommonModels(this.additionalProperties, additionalPropertiesModel, schema);
    } else {
      this.additionalProperties = additionalPropertiesModel;
    }
  }

  /**
   * Adds additionalItems to the model.
   * If another model already exist the two are merged.
   * 
   * @param additionalItemsModel 
   * @param schema 
   */
  addAdditionalItems(additionalItemsModel: CommonModel, schema: Schema): void {
    if (this.additionalItems !== undefined) {
      Logger.warn('While trying to add additionalItems to model, but it is already present, merging models together', additionalItemsModel, schema, this);
      this.additionalItems = CommonModel.mergeCommonModels(this.additionalItems, additionalItemsModel, schema);
    } else {
      this.additionalItems = additionalItemsModel;
    }
  }
  
  /**
   * Adds a patternProperty to the model.
   * If the pattern already exist the two models are merged.
   * 
   * @param pattern 
   * @param patternModel 
   * @param schema schema to the corresponding property model
   */
  addPatternProperty(pattern: string, patternModel: CommonModel, schema: Schema): void {
    if (this.patternProperties === undefined) {this.patternProperties = {};}
    if (this.patternProperties[`${pattern}`] !== undefined) {
      Logger.warn(`While trying to add patternProperty to model, duplicate patterns found. Merging pattern models together for pattern ${pattern}`, patternModel, schema, this);
      this.patternProperties[String(pattern)] = CommonModel.mergeCommonModels(this.patternProperties[String(pattern)], patternModel, schema);
    } else {
      this.patternProperties[String(pattern)] = patternModel;
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
      Logger.error('Found no $id for allOf model and cannot extend the existing model, this should never happen.', this, extendedModel);
      return;
    }
    this.extend = this.extend || [];
    if (this.extend.includes(extendedModel.$id)) { 
      Logger.info(`${this.$id} model already extends model ${extendedModel.$id}.`, this, extendedModel);
      return;
    }
    this.extend.push(extendedModel.$id);
  }

  /**
   * This function returns an array of `$id`s from all the CommonModel's it immediate depends on.
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  getNearestDependencies(): string[] {
    const dependsOn = [];
    if (this.additionalProperties?.$ref !== undefined) {
      dependsOn.push(this.additionalProperties.$ref);
    }
    if (this.extend !== undefined) {
      dependsOn.push(...this.extend);
    }
    if (this.items !== undefined) {
      const items = Array.isArray(this.items) ? this.items : [this.items];
      for (const item of items) {
        const itemRef = item.$ref;
        if (itemRef !== undefined) {
          dependsOn.push(itemRef);
        }
      }
    }
    if (this.properties !== undefined && Object.keys(this.properties).length) {
      const referencedProperties = Object.values(this.properties)
        .filter((propertyModel: CommonModel) => propertyModel.$ref !== undefined)
        .map((propertyModel: CommonModel) => String(propertyModel.$ref));
      dependsOn.push(...referencedProperties);
    }
    if (this.patternProperties !== undefined && Object.keys(this.patternProperties).length) {
      const referencedPatternProperties = Object.values(this.patternProperties)
        .filter((patternPropertyModel: CommonModel) => patternPropertyModel.$ref !== undefined)
        .map((patternPropertyModel: CommonModel) => String(patternPropertyModel.$ref));
      dependsOn.push(...referencedPatternProperties);
    }
    if (this.additionalItems?.$ref !== undefined) {
      dependsOn.push(this.additionalItems.$ref);
    }
    return dependsOn;
  }

  /**
   * Transform object into a type of CommonModel.
   * 
   * @param object to transform
   * @returns CommonModel instance of the object
   */
  static toCommonModel(object: any): CommonModel {
    let newCommonModel = new CommonModel();
    newCommonModel = Object.assign(newCommonModel, object);
    newCommonModel = CommonSchema.transformSchema(newCommonModel, CommonModel.toCommonModel) as CommonModel;
    if (newCommonModel.originalSchema !== undefined) {
      newCommonModel.originalSchema = Schema.toSchema(newCommonModel.originalSchema);
    }
    return newCommonModel;
  }
  /**
   * Merge two common model properties together 
   * 
   * @param mergeTo 
   * @param mergeFrom 
   * @param originalSchema 
   * @param alreadyIteratedModels
   */
  private static mergeProperties(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema | boolean, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()) {
    const mergeToProperties = mergeTo.properties;
    const mergeFromProperties = mergeFrom.properties;
    if (mergeFromProperties !== undefined) {
      if (mergeToProperties === undefined) {
        mergeTo.properties = mergeFromProperties;
      } else {
        for (const [propName, prop] of Object.entries(mergeFromProperties)) {
          if (mergeToProperties[String(propName)] !== undefined) {
            Logger.warn(`Found duplicate properties ${propName} for model. Model property from ${mergeFrom.$id || 'unknown'} merged into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalSchema);
            mergeToProperties[String(propName)] = CommonModel.mergeCommonModels(mergeToProperties[String(propName)], prop, originalSchema, alreadyIteratedModels);
          } else {
            mergeToProperties[String(propName)] = prop;
          }
        }
      }
    }
  }
  /**
   * Merge two common model additionalProperties together 
   * 
   * @param mergeTo 
   * @param mergeFrom 
   * @param originalSchema 
   * @param alreadyIteratedModels
   */
  private static mergeAdditionalProperties(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema | boolean, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()) {
    const mergeToAdditionalProperties = mergeTo.additionalProperties;
    const mergeFromAdditionalProperties = mergeFrom.additionalProperties;
    if (mergeFromAdditionalProperties !== undefined) {
      if (mergeToAdditionalProperties === undefined) {
        mergeTo.additionalProperties = mergeFromAdditionalProperties;
      } else {
        Logger.warn(`Found duplicate additionalProperties for model. additionalProperties from ${mergeFrom.$id || 'unknown'} merged into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalSchema);
        mergeTo.additionalProperties = CommonModel.mergeCommonModels(mergeToAdditionalProperties, mergeFromAdditionalProperties, originalSchema, alreadyIteratedModels);
      }
    }
  }
  /**
   * Merge two common model additionalItems together 
   * 
   * @param mergeTo 
   * @param mergeFrom 
   * @param originalSchema 
   * @param alreadyIteratedModels
   */
  private static mergeAdditionalItems(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema | boolean, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()) {
    const mergeToAdditionalItems = mergeTo.additionalItems;
    const mergeFromAdditionalItems= mergeFrom.additionalItems;
    if (mergeFromAdditionalItems !== undefined) {
      if (mergeToAdditionalItems === undefined) {
        mergeTo.additionalItems = mergeFromAdditionalItems;
      } else {
        Logger.warn(`Found duplicate additionalItems for model. additionalItems from ${mergeFrom.$id || 'unknown'} merged into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalSchema);
        mergeTo.additionalItems = CommonModel.mergeCommonModels(mergeToAdditionalItems, mergeFromAdditionalItems, originalSchema, alreadyIteratedModels);
      }
    }
  }
  /**
   * Merge two common model pattern properties together 
   * 
   * @param mergeTo 
   * @param mergeFrom 
   * @param originalSchema 
   * @param alreadyIteratedModels
   */
  private static mergePatternProperties(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema | boolean, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()) {
    const mergeToPatternProperties = mergeTo.patternProperties;
    const mergeFromPatternProperties = mergeFrom.patternProperties;
    if (mergeFromPatternProperties !== undefined) {
      if (mergeToPatternProperties === undefined) {
        mergeTo.patternProperties = mergeFromPatternProperties;
      } else {
        for (const [pattern, patternModel] of Object.entries(mergeFromPatternProperties)) {
          if (mergeToPatternProperties[String(pattern)] !== undefined) {
            Logger.warn(`Found duplicate pattern ${pattern} for model. Model pattern for ${mergeFrom.$id || 'unknown'} merged into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalSchema);
            mergeToPatternProperties[String(pattern)] = CommonModel.mergeCommonModels(mergeToPatternProperties[String(pattern)], patternModel, originalSchema, alreadyIteratedModels);
          } else {
            mergeToPatternProperties[String(pattern)] = patternModel;
          }
        }
      }
    }
  }

  /**
   * Merge items together, prefer tuples over simple array since it is more strict.
   * 
   * @param mergeTo 
   * @param mergeFrom 
   * @param originalSchema 
   * @param alreadyIteratedModels
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  private static mergeItems(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema | boolean, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()) {
    if (mergeFrom.items === undefined) { return; }
    if (Array.isArray(mergeFrom.items) && mergeFrom.items.length === 0) { return; }
    if (mergeTo.items === undefined) {
      mergeTo.items = mergeFrom.items;
      return;
    }
    const mergeToItems = mergeTo.items;

    //mergeFrom and mergeTo is not tuple
    if (!Array.isArray(mergeFrom.items) && !Array.isArray(mergeToItems)) {
      mergeTo.items = CommonModel.mergeCommonModels(mergeToItems, mergeFrom.items, originalSchema, alreadyIteratedModels); 
    }

    //mergeFrom and mergeTo is tuple
    if (Array.isArray(mergeFrom.items) && Array.isArray(mergeToItems)) {
      for (const [index, mergeFromTupleModel] of mergeFrom.items.entries()) {
        (mergeTo.items as CommonModel[])[Number(index)] = CommonModel.mergeCommonModels(mergeToItems[Number(index)], mergeFromTupleModel, originalSchema, alreadyIteratedModels); 
      }
    }

    //mergeFrom is a tuple && mergeTo is not, use mergeFrom items (the tuple is prioritized)
    if (Array.isArray(mergeFrom.items) && !Array.isArray(mergeToItems)) {
      mergeTo.items = mergeFrom.items;
    }
    //mergeFrom is not tuple && mergeTo is, do nothing
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
   * @param originalSchema 
   * @param alreadyIteratedModels
   */
  static mergeCommonModels(mergeTo: CommonModel | undefined, mergeFrom: CommonModel, originalSchema: Schema | boolean, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()): CommonModel {
    if (mergeTo === undefined) {return mergeFrom;}
    Logger.debug(`Merging model ${mergeFrom.$id || 'unknown'} into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalSchema);
    if (alreadyIteratedModels.has(mergeFrom)) {return alreadyIteratedModels.get(mergeFrom) as CommonModel;}
    alreadyIteratedModels.set(mergeFrom, mergeTo);

    CommonModel.mergeAdditionalProperties(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels);
    CommonModel.mergeAdditionalItems(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels);
    CommonModel.mergePatternProperties(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels);
    CommonModel.mergeProperties(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels);
    CommonModel.mergeItems(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels);
    CommonModel.mergeTypes(mergeTo, mergeFrom);

    if (mergeFrom.enum !== undefined) {
      mergeTo.enum = [... new Set([...(mergeTo.enum || []), ...mergeFrom.enum])];
    }
    if (mergeFrom.required !== undefined) {
      mergeTo.required = [... new Set([...(mergeTo.required || []), ...mergeFrom.required])];
    }
    mergeTo.$id = mergeTo.$id || mergeFrom.$id;
    mergeTo.$ref = mergeTo.$ref || mergeFrom.$ref;
    mergeTo.extend = mergeTo.extend || mergeFrom.extend;
    mergeTo.originalSchema = originalSchema;
    return mergeTo;
  }
}
