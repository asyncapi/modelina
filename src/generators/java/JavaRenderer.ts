import { AbstractRenderer } from '../AbstractRenderer';
import { JavaGenerator, JavaOptions } from './JavaGenerator';
import { CommonModel, CommonInputModel, Preset } from '../../models';
import { FormatHelpers, ModelKind, TypeHelpers } from '../../helpers';

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
    if (
      TypeHelpers.extractKind(model) === ModelKind.PRIMITIVE ||
      TypeHelpers.extractKind(model) === ModelKind.ARRAY
    ) {
      const format = model.getFromSchema('format');
      return this.toClassType(this.toJavaType(format || model.type, model));
    }
    return this.nameType(model.$id, model);
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
      const arrayType = model.items ? this.renderType(model.items) : 'Object';
      if (this.options.collectionType && this.options.collectionType === 'List') {
        return `List<${arrayType}>`;
      }
      return `${arrayType}[]`;
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
