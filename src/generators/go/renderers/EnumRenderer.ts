import { GoRenderer } from '../GoRenderer';
import { EnumPreset, CommonModel } from '../../../models';
import { FormatHelpers } from '../../../helpers';

/**
 * Renderer for Go's `enum` type
 * 
 * @extends GoRenderer
 */
export class EnumRenderer extends GoRenderer {
  public defaultSelf(): string {
    const formattedName = this.nameType(this.model.$id);
    const type = this.enumType(this.model);
    const doc = formattedName && this.renderCommentForEnumType(formattedName, type);
    if (type === 'interface{}') {
      return `${doc}
type ${formattedName} ${type}`;
    }

    const enumValues = this.renderConstValuesForEnumType(formattedName, type, <string[]> this.model.enum);

    return `${doc}
type ${formattedName} ${type}

const (
${this.indent(this.renderBlock(enumValues))}
)`;
  }

  enumType(model: CommonModel): string {
    if (this.model.type === undefined || Array.isArray(this.model.type)) {
      return 'interface{}';
    }

    return this.toGoType(this.model.type, model);
  }

  renderCommentForEnumType(name: string, type: string): string {
    const globalType = type === 'interface{}' ? 'mixed types' : type;
    return this.renderComments(`${name} represents an enum of ${globalType}.`);
  }

  renderConstValuesForEnumType(typeName: string, innerType: string, values: string[]): string[] {
    const fieldNames = values.map(v => 
      typeName.concat(FormatHelpers.upperFirst(FormatHelpers.toCamelCase(v)))
    );

    let enumValues = [innerType === 'string' ? `${fieldNames[0]} ${typeName} = "${values[0]}"` : `${fieldNames[0]} ${typeName} = iota`];

    for (let i = 1; i < values.length; i++) {
      if (innerType === 'string') {
        enumValues = enumValues.concat(`${fieldNames[i]} = "${values[i]}"`);
      }
      if (innerType === 'int') {
        enumValues = enumValues.concat(`${fieldNames[i]}`);
      }
    }

    return enumValues;
  }
}

export const GO_DEFAULT_ENUM_PRESET: EnumPreset<EnumRenderer> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
};
