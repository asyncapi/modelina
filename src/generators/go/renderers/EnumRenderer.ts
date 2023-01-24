import { GoRenderer } from '../GoRenderer';
import { ConstrainedEnumModel } from '../../../models';
import { EnumPresetType } from '../GoPreset';
import { GoOptions } from '../GoGenerator';

/**
 * Renderer for Go's `enum` type
 *
 * This renderer is a generic solution that works for all types of enum values.
 * This is also why you wont see `type MyEnum string´ even if possible.
 *
 * @extends GoRenderer
 */
export class EnumRenderer extends GoRenderer<ConstrainedEnumModel> {
  public defaultSelf(): string {
    const doc = this.renderCommentForEnumType(this.model.name, this.model.type);
    const enumValues = this.renderConstValuesForEnumType();
    const temp = this.model.values.map((value) => {
      return `${this.model.name}Values[${value.key}]: ${value.key},`;
    });
    const values = this.model.values
      .map((value) => {
        return value.value;
      })
      .join(',');

    return `${doc}
type ${this.model.name} uint

const (
${this.indent(this.renderBlock(enumValues))}
)

// Value returns the value of the enum.
func (op ${this.model.name}) Value() any {
	if op >= ${this.model.name}(len(${this.model.name}Values)) {
		return nil
	}
	return ${this.model.name}Values[op]
}

var ${this.model.name}Values = []any{${values}}
var ValuesTo${this.model.name} = map[any]${this.model.name}{
${this.indent(this.renderBlock(temp))}
}
`;
  }

  renderCommentForEnumType(name: string, type: string): string {
    const globalType = type === 'interface{}' ? 'mixed types' : type;
    return this.renderComments(`${name} represents an enum of ${globalType}.`);
  }

  renderConstValuesForEnumType(): string[] {
    return this.model.values.map((enumValue, index) => {
      if (index === 0) {
        return `${enumValue.key} ${this.model.name} = iota`;
      }
      if (typeof enumValue.value === 'string') {
        return enumValue.key;
      }
      return enumValue.key;
    });
  }
}

export const GO_DEFAULT_ENUM_PRESET: EnumPresetType<GoOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  }
};
