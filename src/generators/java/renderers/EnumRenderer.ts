import { JavaRenderer } from "../JavaRenderer";

import { FormatHelpers } from "../../../helpers";

/**
 * Renderer for Java's `enum` type
 * 
 * @extends JavaRenderer
 */
export class EnumRenderer extends JavaRenderer {
  render(): string {
    const enumName = this.model.$id;
    const type = Array.isArray(this.model.type) ? "Object" : this.model.type!;
    const classType = this.toClassType(this.toJavaType(type, this.model));

    return `public enum ${enumName} {
${this.indent(this.renderItems())};

${this.indent(this.renderHelpers(enumName!, classType))}
}`;
  }

  protected renderItems(): string {
    const enums = this.model.enum || [];
    const items = enums.map(e => {
      const key = this.normalizeKey(e);
      const value = this.normalizeValue(e);
      return `${key}(${value})`
    }).join(", ");
    return `${items}`;
  }

  protected normalizeKey(value: any): string {
    switch(typeof value) {
      case "bigint":
      case "number": {
        return FormatHelpers.toConstantCase(`number ${value}`);
      }
      case "boolean": {
        return FormatHelpers.toConstantCase(`boolean ${value}`);
      }
      default: return FormatHelpers.toConstantCase(value);
    }
  }

  protected normalizeValue(value: any): string {
    switch(typeof value) {
      case "string": {
        return `"${value}"`;
      }
      default: return `${value}`;
    }
  }

  protected renderHelpers(enumName: string, classType: string): string {
    return `private ${classType} value;
    
${enumName}(${classType} value) {
  this.value = value;
}
    
@JsonValue
public ${classType} getValue() {
  return value;
}

@Override
public String toString() {
  return String.valueOf(value);
}

@JsonCreator
public static ${enumName} fromValue(${classType} value) {
  for (${enumName} e : ${enumName}.values()) {
    if (e.value.equals(value)) {
      return e;
    }
  }
  throw new IllegalArgumentException("Unexpected value '" + value + "'");
}`;
  }
}
