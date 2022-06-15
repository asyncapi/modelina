import { GoRenderer } from '../GoRenderer';
import { ConstrainedEnumModel } from '../../../models';
import { FormatHelpers } from '../../../helpers';
import { EnumPresetType } from '../GoPreset';
import { GoOptions } from '../GoGenerator';

/**
 * Renderer for Go's `enum` type
 * 
 * @extends GoRenderer
 */
export class EnumRenderer extends GoRenderer<ConstrainedEnumModel> {
  public defaultSelf(): string {
    const doc = this.renderCommentForEnumType(this.model.name, this.model.type);
    // eslint-disable-next-line sonarjs/no-duplicate-string
    if (this.model.type === 'interface{}') {
      return `${doc}
type ${this.model.name} ${this.model.type}`;
    }

    const enumValues = this.renderConstValuesForEnumType(this.model.name, this.model.type, <string[]> this.model.values.map((enumValue) => enumValue.value));

    return `${doc}
type ${this.model.name} ${this.model.type}

const (
${this.indent(this.renderBlock(enumValues))}
)`;
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

export const GO_DEFAULT_ENUM_PRESET: EnumPresetType<GoOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
};
