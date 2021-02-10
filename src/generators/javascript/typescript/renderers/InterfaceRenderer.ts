import { TypeScriptRenderer } from "../TypeScriptRenderer";

/**
 * Renderer for TypeScript's `interface` type
 * 
 * @extends TypeScriptRenderer
 */
export class InterfaceRenderer extends TypeScriptRenderer {
  public render(modelName?: string): string {
    return `interface ${modelName || this.model.$id} {
${this.indent(this.renderProperties())}
}`;
  }
}
