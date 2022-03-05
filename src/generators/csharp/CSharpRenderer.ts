import { AbstractRenderer } from '../AbstractRenderer';
import { CSharpGenerator, CSharpOptions } from './CSharpGenerator';
import { CommonModel, CommonInputModel, Preset, PropertyType } from '../../models';
import { FormatHelpers } from '../../helpers/FormatHelpers';
import { isReservedCSharpKeyword } from './Constants';

/**
 * Common renderer for CSharp types
 * 
 * @extends AbstractRenderer
 */
export abstract class CSharpRenderer extends AbstractRenderer<CSharpOptions> {
  constructor(
    options: CSharpOptions,
    generator: CSharpGenerator,
    presets: Array<[Preset, unknown]>,
    model: CommonModel,
    inputModel: CommonInputModel,
  ) {
    super(options, generator, presets, model, inputModel);
  }

  /**
   * Renders the name of a type based on provided generator option naming convention type function.
   * 
   * This is used to render names of models and then later used if that class is referenced from other models.
   * 
   * @param name 
   * @param model 
   */
  nameType(name: string | undefined, model?: CommonModel): string {
    return this.options?.namingConvention?.type 
      ? this.options.namingConvention.type(name, { model: model || this.model, inputModel: this.inputModel, reservedKeywordCallback: isReservedCSharpKeyword })
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
      ? this.options.namingConvention.property(propertyName, { model: this.model, inputModel: this.inputModel, property, reservedKeywordCallback: isReservedCSharpKeyword })
      : propertyName || '';
  }

  runPropertyPreset(propertyName: string, property: CommonModel, type: PropertyType = PropertyType.property): Promise<string> {
    return this.runPreset('property', { propertyName, property, type });
  }

  renderType(model: CommonModel): string {
    if (model.$ref !== undefined) {
      return this.nameType(model.$ref);
    }

    if (Array.isArray(model.type)) {
      return model.type.length > 1 ? 'dynamic' : `${this.toCSharpType(model.type[0], model)}`;
    }

    return this.toCSharpType(model.type, model);
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    return lines.map(line => `// ${line}`).join('\n');
  }

  toCSharpType(type: string | undefined, model: CommonModel): string {
    switch (type) {
      case 'integer':
      case 'int32':
        return 'int?';
      case 'long':
      case 'int64':
        return 'long?';
      case 'boolean':
        return 'bool?';
      case 'date':
      case 'time':
      case 'dateTime':
      case 'date-time':
        return 'System.DateTime?';
      case 'string':
      case 'password':
      case 'byte':
        return 'string';
      case 'float':
        return 'float?';
      case 'double':
      case 'number':
        return 'double?';
      case 'binary':
        return 'byte[]';
      case 'array': {
        if (Array.isArray(model.items)) {
          return model.items.length > 1 ? 'dynamic[]' : `${this.renderType(model.items[0])}[]`;
        }
        const newType = model.items ? this.renderType(model.items) : 'dynamic';
        if (this.options.collectionType && this.options.collectionType === 'List') {
          return `List<${newType}>`;
        }
        return `${newType}[]`;
      }
      default: return 'dynamic';
    }
  }
}
