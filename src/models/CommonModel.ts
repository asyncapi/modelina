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
   * @param mergeTo 
   * @param mergeFrom 
   * @param originalSchema 
   */
  private static mergeProperties(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema) {
    const mergeToProperties = mergeTo.properties;
    const mergeFromProperties = mergeFrom.properties;
    if (mergeFromProperties !== undefined) {
      if (mergeToProperties === undefined) {
        mergeTo.properties = mergeFromProperties;
      } else {
        for (const [propName, prop] of Object.entries(mergeFromProperties)) {
          if (mergeToProperties[`${propName}`] !== undefined) {
            mergeToProperties[`${propName}`] = CommonModel.mergeCommonModels(mergeToProperties[`${propName}`], prop, originalSchema);
          } else {
            mergeToProperties[`${propName}`] = prop;
          }
        }
      }
    }
  }
  /**
   * Merge two common model additional properties together 
   * @param mergeTo 
   * @param mergeFrom 
   * @param originalSchema 
   */
  private static mergeAdditionalProperties(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema) {
    const mergeToAdditionalProperties = mergeTo.additionalProperties;
    const mergeFromAdditionalProperties = mergeFrom.additionalProperties;
    if (mergeFromAdditionalProperties !== undefined) {
      if (mergeToAdditionalProperties === undefined) {
        mergeTo.additionalProperties = mergeFromAdditionalProperties;
      } else {
        mergeTo.additionalProperties = CommonModel.mergeCommonModels(mergeToAdditionalProperties, mergeFromAdditionalProperties, originalSchema);
      }
    }
  }
  /**
   * Merge two common model pattern properties together 
   * @param mergeTo 
   * @param mergeFrom 
   * @param originalSchema 
   */
  private static mergePatternProperties(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema) {
    const mergeToPatternProperties = mergeTo.patternProperties;
    const mergeFromPatternProperties = mergeFrom.patternProperties;
    if (mergeFromPatternProperties !== undefined) {
      if (mergeToPatternProperties === undefined) {
        mergeTo.patternProperties = mergeFromPatternProperties;
      } else {
        for (const [pattern, patternModel] of Object.entries(mergeFromPatternProperties)) {
          if (mergeToPatternProperties[`${pattern}`] !== undefined) {
            mergeToPatternProperties[`${pattern}`] = CommonModel.mergeCommonModels(mergeToPatternProperties[`${pattern}`], patternModel, originalSchema);
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
   * @param mergeTo CommonModel to merge types into
   * @param mergeFrom CommonModel to merge from
   * @param originalSchema 
   */
  private static mergeItems(mergeTo: CommonModel, mergeFrom: CommonModel, originalSchema: Schema) {
    const merge = (models: CommonModel | CommonModel[] | undefined): CommonModel | undefined => {
      if (Array.isArray(models)) {
        if (models.length > 0) {
          let mergedItemsModel: CommonModel = models[0];
          models.forEach((model) => { mergedItemsModel = CommonModel.mergeCommonModels(mergedItemsModel, model, originalSchema); });
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
          mergeTo.items = CommonModel.mergeCommonModels(mergeToItemsModel, mergeFromItemsModel, originalSchema);
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
   */
  static mergeCommonModels(mergeTo: CommonModel | undefined, mergeFrom: CommonModel, originalSchema: Schema): CommonModel {
    if (mergeTo === undefined) return mergeFrom;

    CommonModel.mergeAdditionalProperties(mergeTo, mergeFrom, originalSchema);
    CommonModel.mergePatternProperties(mergeTo, mergeFrom, originalSchema);
    CommonModel.mergeProperties(mergeTo, mergeFrom, originalSchema);
    CommonModel.mergeItems(mergeTo, mergeFrom, originalSchema);
    CommonModel.mergeTypes(mergeTo, mergeFrom);

    if (mergeFrom.enum !== undefined) {
      mergeTo.enum = [... new Set([...(mergeTo.enum || []), ...mergeFrom.enum])];
    }
    if (mergeFrom.required !== undefined) {
      mergeTo.required = [... new Set([...(mergeTo.required || []), ...mergeFrom.required])];
    }

    // Which values are correct to use here? Is allOf required?
    if (mergeFrom.$id !== undefined) {
      mergeTo.$id = mergeFrom.$id;
    }
    if (mergeFrom.$ref !== undefined) {
      mergeTo.$ref = mergeFrom.$ref;
    }
    if (mergeFrom.extend !== undefined) {
      mergeTo.extend = mergeFrom.extend;
    }
    mergeTo.originalSchema = originalSchema;
    return mergeTo;
  }

  /**
   * Retrieves data from originalSchema by given key
   * 
   * @param key given key
   * @returns {any}
   */
  getFromSchema<K extends keyof Schema>(key: K) {
    let schema = this.originalSchema || {};
    if (typeof schema === 'boolean') schema = {};
    return schema[`${key}`];
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
}
