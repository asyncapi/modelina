import { CommonSchema } from './CommonSchema';
import { Schema } from './Schema';

/**
 * Common representation for the renderers.
 * 
 * @extends CommonSchema<CommonModel>
 */
export class CommonModel extends CommonSchema<CommonModel> {
  extend?: string[]
  originalSchema?: Schema | boolean
  
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

    CommonModel.mergeProperties(mergeTo, mergeFrom, originalSchema);
    CommonModel.mergeItems(mergeTo, mergeFrom, originalSchema);
    CommonModel.mergeTypes(mergeTo, mergeFrom);

    if (mergeFrom.enum !== undefined) {
      if (mergeTo.enum === undefined) {
        mergeTo.enum = mergeFrom.enum;
      } else {
        mergeTo.enum = [...mergeTo.enum, ...mergeFrom.enum];
      }
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
    return schema[key];
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
}
