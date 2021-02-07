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
    const type = Array.isArray(this.model.type) ? this.model.type[0] : this.model.type!;

    switch(type) {
      case "string": {
        return `public enum ${enumName} {
${this.indent(this.renderItems("String"))};

${this.indent(this.renderHelpers(enumName!, "String"))}
}`;
      } 
      case "integer": {
        return `public enum ${enumName} {
${this.indent(this.renderItems("Integer"))};

${this.indent(this.renderHelpers(enumName!, "Integer"))}
}`;
      }
      default: return "";
    }
  }

  protected renderItems(type: "String" | "Integer" = "String"): string {
    const enums = this.model.enum || [];
    const items = enums.map(e => {
      const name = FormatHelpers.toConstantCase(type === "String" ? e : `number ${e}`);
      return `${name}("${e}")`;
    }).join(", ");
    return `${items}`;
  }

  protected renderHelpers(enumName: string, type: "String" | "Integer" = "String"): string {
    return `private ${type} value;
    
${enumName}(${type} value) {
  this.value = value;
}
    
@JsonValue
public ${type} getValue() {
  return value;
}

@Override
public String toString() {
  return String.valueOf(value);
}

@JsonCreator
public static ${enumName} fromValue(${type} value) {
  for (${enumName} e : ${enumName}.values()) {
    if (e.value.equals(value)) {
      return e;
    }
  }
  throw new IllegalArgumentException("Unexpected value '" + value + "'");
}`;
  }
}
