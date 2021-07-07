import { AbstractRenderer } from '../AbstractRenderer';
import { JavaGenerator, JavaOptions } from './JavaGenerator';
import { CommonModel, CommonInputModel, Preset } from '../../models';
import { FormatHelpers, ModelKind, TypeHelpers } from '../../helpers';

export const ReservedJavaKeywordList = [
  'abstract', 
  'continue', 
  'for', 
  'new', 
  'switch  assert', 
  'default', 
  'goto', 
  'package', 
  'synchronized', 
  'boolean', 
  'do', 
  'if', 
  'private', 
  'this', 
  'break', 
  'double', 
  'implements', 
  'protected', 
  'throw', 
  'byte', 
  'else', 
  'import', 
  'public', 
  'throws', 
  'case', 
  'enum', 
  'instanceof', 
  'return', 
  'transient', 
  'catch', 
  'extends', 
  'int', 
  'short', 
  'try', 
  'char', 
  'final', 
  'interface', 
  'static', 
  'void', 
  'class', 
  'finally', 
  'long', 
  'strictfp', 
  'volatile', 
  'const', 
  'float', 
  'native', 
  'super', 
  'while'
];

/**
 * Common renderer for Java types
 * 
 * @extends AbstractRenderer
 */
export abstract class JavaRenderer extends AbstractRenderer<JavaOptions, JavaGenerator> {
  constructor(
    options: JavaOptions,
    generator: JavaGenerator,
    presets: Array<[Preset, unknown]>,
    model: CommonModel, 
    inputModel: CommonInputModel,
  ) {
    super(options, generator, presets, model, inputModel);
  }
  
  static isReservedJavaKeyword(word: string): boolean {
    return ReservedJavaKeywordList.includes(word);
  }

  /**
   * Recursive function to find a realized property name for a CommonModel that can be rendered.
   * 
   * @param originalPropertyName 
   * @param propertyName 
   * @returns 
   */
  getRealizedPropertyName(originalPropertyName: string, propertyName: string = originalPropertyName): string {
    if (JavaRenderer.isReservedJavaKeyword(propertyName)) {
      propertyName = `${this.options.reservedPropertyWord}_${propertyName}`;

      //Make sure that the found property name is not part of one of the other properties that is being rendered
      const formattedPropertyName = this.nameProperty(propertyName);
      const propertyList = [...Object.keys(this.model.properties || {})];
      if ((originalPropertyName !== formattedPropertyName && propertyList.includes(formattedPropertyName))) {
        propertyName = `${this.options.reservedPropertyWord}_${propertyName}`;
        return this.getRealizedPropertyName(originalPropertyName, propertyName);
      }
    }
    return propertyName;
  }

  /**
   * Renders the name of a type based on provided generator option naming convention type function.
   * 
   * This is used to render names of models (example TS class) and then later used if that class is referenced from other models.
   * 
   * @param name 
   * @param model 
   */
  nameType(name: string, model?: CommonModel): string {
    return this.options?.namingConvention?.type 
      ? this.options.namingConvention.type(name, { model: model || this.model, inputModel: this.inputModel })
      : name || '';
  }

  /**
   * Renders the name of a property based on provided generator option naming convention property function.
   * 
   * @param propertyName 
   * @param property
   */
  nameProperty(propertyName: string, property?: CommonModel): string {
    const realizedPropertyName = this.getRealizedPropertyName(propertyName);
    return this.options?.namingConvention?.property 
      ? this.options.namingConvention.property(realizedPropertyName, { model: this.model, inputModel: this.inputModel, property, modelPropertyName: propertyName })
      : realizedPropertyName || '';
  }
  
  /**
   * Renders model(s) to Java type(s).
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
      const format = model.getFromSchema('format');
      return this.toClassType(this.toJavaType(format || model.type, model));
    }
    return this.nameType(`${model.$id}`, model);
  }

  /**
   * Returns the Java corresponding type from CommonModel type or JSON schema format
   * @param type 
   * @param model 
   */
  toJavaType(type: string | undefined, model: CommonModel): string {
    switch (type) {
    case 'integer':
    case 'int32':
      return 'int';
    case 'long':
    case 'int64':
      return 'long';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'java.time.LocalDate';
    case 'time':
      return 'java.time.OffsetTime';
    case 'dateTime':
    case 'date-time':
      return 'java.time.OffsetDateTime';
    case 'string':
    case 'password':
    case 'byte':
      return 'String';
    case 'float':
      return 'float';
    case 'double':
    case 'number':
      return 'double';
    case 'binary':
      return 'byte[]';
    case 'array': {
      let arrayItemModel = model.items;
      //Since Java dont support tuples, lets make sure that we combine the tuple types to find the appropriate array type 
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
      return 'Integer';
    case 'long':
      return 'Long';
    case 'boolean':
      return 'Boolean';
    case 'float':
      return 'Float';
    case 'double':
      return 'Double';
    default:
      return type;
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
