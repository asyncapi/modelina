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
    // eslint-disable-next-line sonarjs/no-duplicate-string
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
    const firstName = typeName.concat(FormatHelpers.upperFirst(FormatHelpers.toCamelCase(values[0].toString())));

    let enumValues = [innerType === 'string' ? `${firstName} ${typeName} = "${values[0]}"` : `${firstName} ${typeName} = iota`];

    for (const value of values.slice(1)) {
      const name = typeName.concat(FormatHelpers.upperFirst(FormatHelpers.toCamelCase(value)));

      if (innerType === 'string') {
        enumValues = enumValues.concat(`${name} = "${value}"`);
      }
      if (innerType === 'int') {
        enumValues = enumValues.concat(`${name}`);
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
