import { TypeScriptRenderer } from "../TypeScriptRenderer";

import { TypeHelpers, ModelKind } from "../../../../helpers";

/**
 * Renderer for TypeScript's `type` type
 * 
 * @extends TypeScriptRenderer
 */
export class TypeRenderer extends TypeScriptRenderer {
  public render(modelName?: string): string {
    const body = this.renderTypeBody();
    return `type ${modelName || this.model.$id} = ${body};`;
  }

  protected renderTypeBody(): string {
    const kind = TypeHelpers.extractKind(this.model);
    switch(kind) {
      case ModelKind.OBJECT: {
        return this.renderObject();
      }
      case ModelKind.ENUM: {
        return this.renderEnum();
      }
      default: return this.renderType(this.model);
    }
  }

  protected renderObject(): string {
    return `{
${this.indent(this.renderProperties())}
}`;
  }

  protected renderEnum(): string {
    const enums = this.model.enum || [];
    return enums.map(t => typeof t === "string" ? `"${t}"` : t).join(" | ");
  }
}
