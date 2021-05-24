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
  getFromSchema<K extends keyof Schema>(key: K) {
    const schema = this.originalSchema || {};
    if (typeof schema === 'boolean') return undefined;
    return schema[`${key}`];
  }

  /**
   * Set the types of the model
   * 
   * @param types to set the model type to
   */
  setType(types : string | string[]) {
    if (!Array.isArray(types) || types.length > 1) {
      this.type = types;
    } else if (types.length === 0) {
      this.type = undefined;
    } else if (types.length === 1) {
      this.type = types[0];
    }
  }

  /**
   * Adds types to the existing model types.
   * 
   * Makes sure to only keep a single type incase of duplicates.
   * 
   * @param types which types we should try and add to the existing output
   */
  addTypes(types: string[] | string) {
    if (Array.isArray(types)) {
      types.forEach((value) => {
        this.addTypes(value);
      });
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
   * @param schema schema to the corresponding property model
   */
  addItem(itemModel: CommonModel, schema: Schema) {
    if (this.items !== undefined) {
      Logger.warn(`While trying to add item to model ${this.$id}, duplicate items found. Merging models together to form a unified item model.`, itemModel, schema, this);
      this.items = CommonModel.mergeCommonModels(this.items as CommonModel, itemModel, schema);
    } else {
      this.items = itemModel;
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
  addProperty(propertyName: string, propertyModel: CommonModel, schema: Schema) {
    if (this.properties === undefined) this.properties = {};
    if (this.properties[`${propertyName}`] !== undefined) {
      Logger.warn(`While trying to add property to model, duplicate properties found. Merging models together for property ${propertyName}`, propertyModel, schema, this);
      this.properties[`${propertyName}`] = CommonModel.mergeCommonModels(this.properties[`${propertyName}`], propertyModel, schema);
    } else {
      this.properties[`${propertyName}`] = propertyModel;
    }
  }

  /**
   * Adds additionalProperty to the model.
   * If another model already are added the two are merged.
   * 
   * @param additionalPropertiesModel 
   * @param schema 
   */
  addAdditionalProperty(additionalPropertiesModel: CommonModel, schema: Schema) {
    if (this.additionalProperties !== undefined) {
      Logger.warn('While trying to add additionalProperties to model, but it is already present, merging models together', additionalPropertiesModel, schema, this);
      this.additionalProperties = CommonModel.mergeCommonModels(this.additionalProperties, additionalPropertiesModel, schema);
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
   * @param schema schema to the corresponding property model
   */
  addPatternProperty(pattern: string, patternModel: CommonModel, schema: Schema) {
    if (this.patternProperties ===  undefined) this.patternProperties = {};
    if (this.patternProperties[`${pattern}`] !== undefined) {
      Logger.warn(`While trying to add patternProperty to model, duplicate patterns found. Merging pattern models together for pattern ${pattern}`, patternModel, schema, this);
      this.patternProperties[`${pattern}`] = CommonModel.mergeCommonModels(this.patternProperties[`${pattern}`], patternModel, schema);
    } else {
      this.patternProperties[`${pattern}`] = patternModel;
    }
  }
  
  /**
   * Adds another model this model should extend.
   * 
   * It is only allowed to extend if the other model have $id and is not already being extended.
   * 
   * @param extendedModel 
   */
  addExtendedModel(extendedModel: CommonModel) {
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
  getImmediateDependencies(): string[] {
    const dependsOn = [];
    if (this.additionalProperties instanceof CommonModel) {
      const additionalPropertiesRef = (this.additionalProperties as CommonModel).$ref;
      if (additionalPropertiesRef !== undefined) {
        dependsOn.push(additionalPropertiesRef);
      }
    }
    if (this.extend !== undefined) {
      for (const extendedSchema of this.extend) {
        dependsOn.push(extendedSchema);
      }
    }
    if (this.items instanceof CommonModel) {
      const itemsRef = (this.items as CommonModel).$ref;
      if (itemsRef !== undefined) {
        dependsOn.push(itemsRef);
      }
    }
    if (this.properties !== undefined && Object.keys(this.properties).length) {
      const referencedProperties = Object.values(this.properties)
        .filter((propertyModel: CommonModel) => propertyModel.$ref !== undefined)
        .map((propertyModel: CommonModel) => `${propertyModel.$ref}`);
      dependsOn.push(...referencedProperties);
    }
    return dependsOn;
  }

  /**
   * Transform object into a type of CommonModel.
   * 
   * @param object to transform
   * @returns CommonModel instance of the object
   */
  static toCommonModel(object: unknown): CommonModel {
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
  private static mergeProperties(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()) {
    const mergeToProperties = mergeTo.properties;
    const mergeFromProperties = mergeFrom.properties;
    if (mergeFromProperties !== undefined) {
      if (mergeToProperties === undefined) {
        mergeTo.properties = mergeFromProperties;
      } else {
        for (const [propName, prop] of Object.entries(mergeFromProperties)) {
          if (mergeToProperties[`${propName}`] !== undefined) {
            Logger.warn(`Found duplicate properties ${propName} for model. Model property from ${mergeFrom.$id || 'unknown'} merged into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalSchema);
            mergeToProperties[`${propName}`] = CommonModel.mergeCommonModels(mergeToProperties[`${propName}`], prop, originalSchema, alreadyIteratedModels);
          } else {
            mergeToProperties[`${propName}`] = prop;
          }
        }
      }
    }
  }
  /**
   * Merge two common model additional properties together 
   * 
   * @param mergeTo 
   * @param mergeFrom 
   * @param originalSchema 
   * @param alreadyIteratedModels
   */
  private static mergeAdditionalProperties(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()) {
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
   * Merge two common model pattern properties together 
   * 
   * @param mergeTo 
   * @param mergeFrom 
   * @param originalSchema 
   * @param alreadyIteratedModels
   */
  private static mergePatternProperties(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()) {
    const mergeToPatternProperties = mergeTo.patternProperties;
    const mergeFromPatternProperties = mergeFrom.patternProperties;
    if (mergeFromPatternProperties !== undefined) {
      if (mergeToPatternProperties === undefined) {
        mergeTo.patternProperties = mergeFromPatternProperties;
      } else {
        for (const [pattern, patternModel] of Object.entries(mergeFromPatternProperties)) {
          if (mergeToPatternProperties[`${pattern}`] !== undefined) {
            Logger.warn(`Found duplicate pattern ${pattern} for model. Model pattern for ${mergeFrom.$id || 'unknown'} merged into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalSchema);
            mergeToPatternProperties[`${pattern}`] = CommonModel.mergeCommonModels(mergeToPatternProperties[`${pattern}`], patternModel, originalSchema, alreadyIteratedModels);
          } else {
            mergeToPatternProperties[`${pattern}`] = patternModel;
          }
        }
      }
    }
  }

  /**
   * Merge items together so only one CommonModel remains.
   * 
   * @param mergeTo 
   * @param mergeFrom 
   * @param originalSchema 
   * @param alreadyIteratedModels
   */
  private static mergeItems(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()) {
    const merge = (models: CommonModel | CommonModel[] | undefined): CommonModel | undefined => {
      if (!Array.isArray(models)) return models;
      let mergedItemsModel: CommonModel | undefined = undefined;
      models.forEach((model, index) => { 
        Logger.warn(`Found duplicate items at index ${index} for model. Model item for ${mergeFrom.$id || 'unknown'} merged into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalSchema);
        mergedItemsModel = CommonModel.mergeCommonModels(mergedItemsModel, model, originalSchema, alreadyIteratedModels); 
      });
      return mergedItemsModel;
    };
    if (mergeFrom.items !== undefined) {
      //Incase of arrays, merge them into a single model
      const mergeFromItemsModel = merge(mergeFrom.items);
      const mergeToItemsModel = merge(mergeTo.items);
      if (mergeFromItemsModel !== undefined) {
        if (mergeToItemsModel === undefined) {
          mergeTo.items = mergeFromItemsModel;
        } else {
          Logger.warn(`Found duplicate item for model. Model item for ${mergeFrom.$id || 'unknown'} merged into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalSchema);
          mergeTo.items = CommonModel.mergeCommonModels(mergeToItemsModel, mergeFromItemsModel, originalSchema, alreadyIteratedModels);
        }
      }
    } else if (mergeTo.items !== undefined) {
      mergeTo.items = merge(mergeTo.items);
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
      } else {
        if (Array.isArray(mergeFrom.type)) {
          mergeFrom.type.forEach(addToType);
          return;
        }
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
  static mergeCommonModels(mergeTo: CommonModel | undefined, mergeFrom: CommonModel, originalSchema: Schema, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()): CommonModel {
    if (mergeTo === undefined) return mergeFrom;
    Logger.debug(`Merging model ${mergeFrom.$id || 'unknown'} into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalSchema);
    if (alreadyIteratedModels.has(mergeFrom)) return alreadyIteratedModels.get(mergeFrom) as CommonModel;
    alreadyIteratedModels.set(mergeFrom, mergeTo);

    CommonModel.mergeAdditionalProperties(mergeTo, mergeFrom, originalSchema, alreadyIteratedModels);
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
