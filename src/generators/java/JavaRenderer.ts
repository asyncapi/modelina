import { AbstractRenderer } from "../AbstractRenderer";
import { JavaGenerator, JavaOptions } from "./JavaGenerator";

import { CommonModel, CommonInputModel } from "../../models";
import { FormatHelpers } from "../../helpers";

/**
 * Common renderer for Java types
 * 
 * @extends AbstractRenderer
 */
export abstract class JavaRenderer extends AbstractRenderer<JavaOptions> {
  constructor(
    protected model: CommonModel, 
    protected inputModel: CommonInputModel,
    protected options: JavaOptions = JavaGenerator.defaultOptions,
  ) {
    super({ ...JavaGenerator.defaultOptions, ...options });
  }

  protected renderType(model: CommonModel | CommonModel[]): string {
    if (Array.isArray(model) || Array.isArray(model.type)) {
      return `Object`; // fallback
    }
    if (model.$ref !== undefined) {
      return model.$ref;
    }
    return this.toClassType(this.toJavaType(model.type, model));
  }

  protected toJavaType(type: string | undefined, model: CommonModel): string {
    switch(type) {
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
        const types = model?.items ? this.renderType(model.items) : 'Object';
        return `Array<${types}>`;
      }
      default:
        return 'Object';
    }
  }

  protected toClassType(type: string): string {
    switch(type) {
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

  protected renderAnnotation(annotation: any): string;
  protected renderAnnotation(annotations: Array<any>): string;
  protected renderAnnotation(annotation: Array<any> | any): string {
    if (Array.isArray(annotation)) {
      return annotation.map(ann => this.renderAnnotation(ann)).join(" ");
    }
    const name = `@${FormatHelpers.upperFirst(annotation.name)}`;
    if (annotation.body) {
      return `${name}(${annotation.body})`;
    }
    return name;
  }
}
