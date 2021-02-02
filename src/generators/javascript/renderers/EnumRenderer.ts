import { TypeScriptRenderer } from "./CommonRenderer";

export class EnumRenderer extends TypeScriptRenderer {
  public render(): string {
    const items = this.renderItems();
    return `enum ${this.modelName} {
${this.indent(items)}
}`;
  }

  protected renderItems(): string {
    const enums = this.model.enum!;
    const items = enums.map(e => this.renderItem(e));
    return this.renderBlock(items);
  }

  protected renderItem(item: string): string {
    return `${this.normalizeKey(item)} = '${item}',`;
  }

  protected normalizeKey(key: string): string {
    return key;
  }
}
