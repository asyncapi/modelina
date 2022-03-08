/* eslint-disable sonarjs/cognitive-complexity */
import { AbstractRenderer } from '../AbstractRenderer';
import { JSONGenerator, JSONOptions } from './JSONGenerator';
import { CommonModel, CommonInputModel, Preset } from '../../models';

/**
 * Common renderer for JSON type
 * 
 * @externs AbstractRenderer
 */

export class JSONRenderer extends AbstractRenderer<JSONOptions, JSONGenerator> {
  constructor(
    options: JSONOptions,
    generator: JSONGenerator,
    presets: Array<[Preset, unknown]>,
    model: CommonModel,
    inputModel: CommonInputModel,
  ) {
    super(options,generator,presets,model,inputModel);
  }

  /**
   * Renders the name of a type based on provided generator option naming convention type function.
   * 
   * This is used to render names of models and then later used if it is referenced from other models.
   * 
   * @param name 
   * @param model 
   */
  nameType(name: string | undefined, model?: CommonModel): string {
    return this.options?.namingConvention?.type 
      ? this.options.namingConvention.type(name, { model: model || this.model, inputModel: this.inputModel})
      : name || '';
  }

  /**
   * Renders the name of a property based on provided generator option naming convention property function.
   * 
   * @param propertyName 
   * @param property
   */
  nameProperty(propertyName: string | undefined, property?: CommonModel): string {
    return this.options?.namingConvention?.property 
      ? this.options.namingConvention.property(propertyName, { model: this.model, inputModel: this.inputModel, property })
      : propertyName || '';
  }

  /**
   * Renders type(s) of the model.
   * 
   * @param model
   */
  renderType(model: CommonModel): string {
    if (Array.isArray(model)) {
      return JSON.stringify(model.map((m) => this.renderType(m)));
    }
    if (model.type) {
      if (Array.isArray(model.type)) {
        return 'array';
      }
      return model.type;
    }
    return 'any';
  }

  /**
   * Renders all the properties possible of a model
   * 
   * @param model 
   * @returns Record<string,any>
   */
  renderAllProperties(model: CommonModel): Record<string,any> {
    const properties = model.properties || {};

    const propertyContent: Record<any,any> = {};
    const additionalPropertyContent: boolean | CommonModel = 
      model.additionalProperties ? model.additionalProperties : true;
    const patternPropertyContent: Record<any,any> = {};

    // delete properties.originalInput;
    for (const [propertyName, property] of Object.entries(properties)) {
      if (propertyName !== 'originalInput') {
        // delete originalInput if present as key in value of each property entry
        const modifiedProperty = this.deleteOriginalInputKeyValue(property);
        if (property.type && property.type === 'array') {
          propertyContent[`${propertyName}`] = this.renderArray(modifiedProperty as CommonModel);
        } else if (property.type && property.type === 'object') {
          propertyContent[`${propertyName}`] = this.renderObject(modifiedProperty as CommonModel);
        } else {
          propertyContent[`${propertyName}`] = modifiedProperty;
        }
      }
    }

    if (additionalPropertyContent !== true) {
      delete additionalPropertyContent.originalInput;
    }

    // dealing with patternProperties
    if (model.patternProperties !== undefined) {
      const pattern = this.deleteOriginalInputKeyValue(model.patternProperties);
      for (const [patternName, patternProperty] of Object.entries(pattern)) {
        const newPatternProperty = this.deleteOriginalInputKeyValue(patternProperty);
        patternPropertyContent[`${patternName}`] = newPatternProperty;
      }
    }

    const ans:Record<string,any> = {};
    if (Object.keys(propertyContent).length > 0) {
      ans.properties = propertyContent;
    }
    if (Object.keys(additionalPropertyContent).length > 0) {
      ans.additionalProperties = additionalPropertyContent;
    }
    if (Object.keys(patternPropertyContent).length > 0) {
      ans.patternProperties = patternPropertyContent;
    }

    return ans;
  }

  /**
   * Renders model of type array 
   * 
   * @param model
   * @returns Record<string,any>
   */
  renderArray(model: CommonModel): Record<string,any> {
    const renderAdditionalItemsType = model.additionalItems?.type ? model.additionalItems.type : [];
    let items;
    if (Array.isArray(model.items)) {
      items = model.items.map((it) => this.renderObject(it));
    } else if (model.items) {
      items = this.renderObject(model.items);
    } else {
      items = null;
    }

    return {
      additionalItems: renderAdditionalItemsType,
      items
    };
  }

  /**
   * Renders model of type object
   *  
   * @param model 
   * @returns Record<string,any>
   */
  renderObject(model: CommonModel): Record<string,any> {
    const newModel = this.deleteOriginalInputKeyValue(model);
    return {
      ...newModel
    };
  }

  /**
   * Deletes the 'originalInput' property and returns the rest of the properties
   * as an object
   * 
   * @param property 
   * @returns Record<string,any>
   */
  deleteOriginalInputKeyValue(property : Record<string,any>): Record<string,any> {
    delete property.originalInput;
    return property;
  }
}

