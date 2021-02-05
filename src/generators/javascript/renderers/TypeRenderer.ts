import { TypeScriptRenderer } from "../TypeScriptRenderer";
import { InterfaceRenderer } from "./InterfaceRenderer";

import { TypeHelpers, ModelKind } from "../../../helpers";

/**
 * Renderer for TypeScript's `interface` type
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
      case ModelKind.ENUM: {
        return this.renderEnum();
      }
      default: return this.renderType(this.model);
    }
  }

  protected renderEnum(): string {
    return (this.model.enum || []).map(t => typeof t === "string" ? `"${t}"` : t).join(" | ");
  }
}
