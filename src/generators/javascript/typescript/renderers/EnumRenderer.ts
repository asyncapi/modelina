import { TypeScriptRenderer } from "../TypeScriptRenderer";

/**
 * Renderer for TypeScript's `enum` type
 * 
 * @extends TypeScriptRenderer
 */
export class EnumRenderer extends TypeScriptRenderer {
  public render(): string {
    return `enum ${this.model.$id} {
${this.indent(this.renderItems())}
}`;
  }

  protected renderItems(): string {
    const enums = this.model.enum || [];
    const items = enums.map(e => this.renderItem(e));
    return this.renderBlock(items);
  }

  protected renderItem(item: string): string {
    return `${this.normalizeKey(item)} = "${item}",`;
  }

  protected normalizeKey(key: string): string {
    return key;
  }

  protected runItemPreset(value: any): Promise<string> {
    return this.runPreset("item", { value });
  }
}
