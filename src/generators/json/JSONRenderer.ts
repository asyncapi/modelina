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
    super(options,generator,presets,model, inputModel);
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
   * Renders JSON Schema type(s).
   * 
   * @param model
   */
  renderType(model: CommonModel | CommonModel[]): string {
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
   * Render all the properties for the model by calling the property preset per property.
   */
  renderProperties(model: CommonModel): Record<string,any> | Array<Record<string,any>> {
    const properties = model.properties || {};
    const propertyContent: Record<any,any> = {};
    const additionalPropertyContent: boolean | CommonModel = 
      model.additionalProperties ? model.additionalProperties : true;
    const patternPropertyContent: Record<any,any> = {};

    // delete properties.originalInput;
    for (const [propertyName, property] of Object.entries(properties)) {
      if (propertyName !== 'originalInput') {
        // delete originalInput if present in value
        const modifiedProperty = this.deleteOriginalInputKeyValue(property);
        propertyContent[`${propertyName}`] = modifiedProperty;
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

    return {
      properties: propertyContent,
      additionalProperties: additionalPropertyContent,
      patternProperty: patternPropertyContent
    };
  }

  /**
   * Renders items f.
   * 
   * @param model
   */
  renderArray(model: CommonModel | CommonModel[]): Record<string,any> | Array<Record<string,any>> {
    if (Array.isArray(model)) {
      return (model.map((m) => this.renderArray(m)));
    }
    const renderAdditionalItemsType = model.additionalItems?.type ? model.additionalItems.type : [];
    let renderItems;
    if (Array.isArray(model.items)) {
      renderItems = model.items.map((it) => this.renderArray(it));
    } else if (model.items) {
      renderItems = {
        type: model.items.type,
        $id: model.items.$id
      };
    } else {
      renderItems = [];
    }

    return {
      additionalItems: renderAdditionalItemsType,
      items: renderItems
    };
  }

  deleteOriginalInputKeyValue(property : Record<string,any>): Record<string,any> {
    delete property.originalInput;
    return property;
  }
}

