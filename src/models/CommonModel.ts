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
    let schema = this.originalSchema || {};
    if (typeof schema === 'boolean') return undefined;
    return schema[`${key}`];
  }

  /**
   * Set the types of the model
   * 
   * @param types to set the model type to
   */
  setType(types : string | string[]) {
    if (Array.isArray(types)) {
      if (types.length === 0) {
        this.type = undefined;
        return;
      } else if (types.length === 1) {
        this.type = types[0];
        return;
      }
    }
    this.type = types;
  }

  /**
   * Adds types to the existing model types.
   * 
   * Makes sure to only keep a single type incase of duplicates.
   * 
   * @param types which types we should try and add to the existing output
   */
  addToTypes(types: string[] | string) {
    if (Array.isArray(types)) {
      types.forEach((value) => {
        this.addToTypes(value);
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
      Object.entries(this.properties).forEach(([, propertyModel]) => {
        if (propertyModel.$ref !== undefined) {
          dependsOn.push(propertyModel.$ref);
        }
      });
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
   * @param mergeTo CommonModel to merge properties into
   * @param mergeFrom CommonModel to merge properties from
   * @param originalSchema schema to use as original schema
   * @param alreadyIteratedModels to handle circular models correctly
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
   * @param mergeTo CommonModel to merge additional properties into
   * @param mergeFrom CommonModel to merge additional properties from
   * @param originalSchema schema to use as original schema
   * @param alreadyIteratedModels to handle circular models correctly
   */
  private static mergeAdditionalProperties(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()) {
    const mergeToAdditionalProperties = mergeTo.additionalProperties;
    const mergeFromAdditionalProperties = mergeFrom.additionalProperties;
    if (mergeFromAdditionalProperties !== undefined) {
      if (mergeToAdditionalProperties !== undefined) {
        mergeTo.additionalProperties = CommonModel.mergeCommonModels(mergeToAdditionalProperties, mergeFromAdditionalProperties, originalSchema, alreadyIteratedModels);
      } else {
        mergeTo.additionalProperties = mergeFromAdditionalProperties;
      }
    }
  }
  /**
   * Merge two common model pattern properties together 
   * 
   * @param mergeTo CommonModel to merge pattern properties into
   * @param mergeFrom CommonModel to merge pattern properties from
   * @param originalSchema schema to use as original schema
   * @param alreadyIteratedModels to handle circular models correctly
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
   * @param mergeTo CommonModel to merge items into
   * @param mergeFrom CommonModel to merge items from
   * @param originalSchema schema to use as original schema
   * @param alreadyIteratedModels to handle circular models correctly
   */
  private static mergeItems(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()) {
    const merge = (models: CommonModel | CommonModel[] | undefined): CommonModel | undefined => {
      if (Array.isArray(models)) {
        if (models.length > 0) {
          let mergedItemsModel: CommonModel | undefined = undefined;
          models.forEach((model) => { 
            mergedItemsModel = CommonModel.mergeCommonModels(mergedItemsModel, model, originalSchema, alreadyIteratedModels); 
          });
          return mergedItemsModel;
        } 
        return undefined;
      }
      return models;
    };
    if (mergeFrom.items !== undefined) {
      //Incase of arrays, merge them into a single schema
      const mergeFromItemsModel = merge(mergeFrom.items);
      const mergeToItemsModel = merge(mergeTo.items);
      if (mergeFromItemsModel !== undefined) {
        if (mergeToItemsModel !== undefined) {
          mergeTo.items = CommonModel.mergeCommonModels(mergeToItemsModel, mergeFromItemsModel, originalSchema, alreadyIteratedModels);
        } else {
          mergeTo.items = mergeFromItemsModel;
        }
      }
    } else if (mergeTo.items !== undefined) {
      mergeTo.items = merge(mergeTo.items);
    }
  }

  /**
   * Merge types together
   * 
   * @param mergeTo CommonModel to merge types into
   * @param mergeFrom CommonModel to merge from
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
   * @param mergeTo CommonModel to merge into
   * @param mergeFrom CommonModel to merge values from
   * @param originalSchema schema to use as original schema
   * @param alreadyIteratedModels to handle circular models correctly
   */
  static mergeCommonModels(mergeTo: CommonModel | undefined, mergeFrom: CommonModel, originalSchema: Schema, alreadyIteratedModels: Map<CommonModel, CommonModel> = new Map()): CommonModel {
    if (mergeTo === undefined) return mergeFrom;
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

    // Which values are correct to use here? Is allOf required?
    if (mergeFrom.$id !== undefined && mergeTo.$id === undefined) {
      mergeTo.$id = mergeFrom.$id;
    }
    if (mergeFrom.$ref !== undefined && mergeTo.$ref === undefined) {
      mergeTo.$ref = mergeFrom.$ref;
    }
    if (mergeFrom.extend !== undefined && mergeTo.extend === undefined) {
      mergeTo.extend = mergeFrom.extend;
    }
    mergeTo.originalSchema = originalSchema;
    return mergeTo;
  }
}
