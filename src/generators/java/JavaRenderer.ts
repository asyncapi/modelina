import { AbstractRenderer } from "../AbstractRenderer";
import { JavaGenerator, JavaOptions } from "./JavaGenerator";

import { FormatHelpers } from "../../helpers";
import { CommonModel, CommonInputModel } from "../../models";

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

  protected renderType(model: CommonModel): string {
    if (model.$ref !== undefined) {
      return model.$ref;
    }

    const type = typeof model === "string" ? model : model.type;
    switch (type) {
    case 'string':
      return 'String';
    case 'integer':
      return 'Long';
    case 'number':
      return 'double';
    case 'boolean':
      return 'boolean';
    case 'array': {
      const t = model.items && !Array.isArray(model.items) ? this.renderType(model.items) : 'void';
      return `${t}[]`;
    }
    default: return Array.isArray(type) ? this.renderType(type[0] as any) : "void"; // fallback - it should be changed for union...
    }
  }
}