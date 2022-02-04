import { AbstractRenderer } from '../AbstractRenderer';
import { DartGenerator, DartOptions } from './DartGenerator';
import { CommonModel, CommonInputModel, Preset } from '../../models';
import { FormatHelpers, ModelKind, TypeHelpers } from '../../helpers';
import { isReservedDartKeyword } from './Constants';

/**
 * Common renderer for Dart types
 * 
 * @extends AbstractRenderer
 */
export abstract class DartRenderer extends AbstractRenderer<DartOptions, DartGenerator> {
  constructor(
    options: DartOptions,
    generator: DartGenerator,
    presets: Array<[Preset, unknown]>,
    model: CommonModel, 
    inputModel: CommonInputModel,
  ) {
    super(options, generator, presets, model, inputModel);
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
      ? this.options.namingConvention.type(name, { model: model || this.model, inputModel: this.inputModel, reservedKeywordCallback: isReservedDartKeyword })
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
      ? this.options.namingConvention.property(propertyName, { model: this.model, inputModel: this.inputModel, property, reservedKeywordCallback: isReservedDartKeyword })
      : propertyName || '';
  }
  
  /**
   * Renders model(s) to Dart type(s).
   * 
   * @param model
   */
  renderType(model: CommonModel | CommonModel[]): string {
    if (Array.isArray(model) || Array.isArray(model.type)) {
      return 'Object'; // fallback
    }
    if (model.$ref !== undefined) {
      return this.nameType(model.$ref, model);
    }
    const kind = TypeHelpers.extractKind(model);
    if (
      kind === ModelKind.PRIMITIVE ||
      kind === ModelKind.ARRAY
    ) {
      const format = model.getFromOriginalInput('format');
      return this.toClassType(this.toDartType(format || model.type, model));
    }
    return this.nameType(model.$id, model);
  }

  /**
   * Returns the Dart corresponding type from CommonModel type or JSON schema format
   * @param type 
   * @param model 
   */
  toDartType(type: string | undefined, model: CommonModel): string {
    switch (type) {
    case 'integer':
    case 'int32':
    case 'long':
    case 'int64':
      return 'int';
    case 'boolean':
      return 'bool';
    case 'date':
      return 'LocalDate';
    case 'time':
      return 'OffsetTime';
    case 'dateTime':
    case 'date-time':
      return 'OffsetDateTime?';
    case 'string':
    case 'password':
    case 'byte':
      return 'String';
    case 'float':
    case 'double':
    case 'number':
      return 'double';
    case 'binary':
      return 'byte[]';
    case 'array': {
      let arrayItemModel = model.items;
      //Since Dart dont support tuples, lets make sure that we combine the tuple types to find the appropriate array type 
      if (Array.isArray(model.items)) {
        arrayItemModel = model.items.reduce((prevModel, currentModel) => {
          return CommonModel.mergeCommonModels(CommonModel.toCommonModel(prevModel), CommonModel.toCommonModel(currentModel), {});
        });
        //If tuples and additionalItems make sure to find the appropriate type by merging all the tuples and additionalItems model together to find the combined type.
        if (model.additionalItems !== undefined) {
          arrayItemModel = CommonModel.mergeCommonModels(arrayItemModel, model.additionalItems, {});
        }
      }
      const newType = arrayItemModel ? this.renderType(arrayItemModel) : 'Object';
      if (this.options.collectionType && this.options.collectionType === 'List') {
        return `List<${newType}>`;
      }
      return `${newType}[]`;
    }
    default:
      return 'Object';
    }
  }

  toClassType(type: string): string {
    switch (type) {
    case 'int':
      return 'int';
    case 'long':
      return 'long';
    case 'boolean':
      return 'bool';
    case 'float':
    case 'double':
      return 'double';
    default:
      return `${type}`;
    }
  }

  renderComments(lines: string | string[]): string {
    lines = FormatHelpers.breakLines(lines);
    const newLiteral = lines.map(line => ` * ${line}`).join('\n');
    return `/**
${newLiteral}
 */`;
  }

  renderAnnotation(annotationName: string, value?: any | Record<string, any>): string {
    const name = `@${FormatHelpers.upperFirst(annotationName)}`;
    let values = undefined;
    if (value !== undefined) {
      if (typeof value === 'object') {
        values = Object.entries(value || {}).map(([paramName, newValue]) => {
          if (paramName && newValue !== undefined) {
            return `${paramName}=${newValue}`;
          }
          return newValue;
        }).filter(v => v !== undefined).join(', ');
      } else {
        values = value;
      }
    }
    return values !== undefined ? `${name}(${values})` : name;
  }
}
