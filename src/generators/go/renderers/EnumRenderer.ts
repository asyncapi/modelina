import { GoRenderer } from '../GoRenderer';
import {
  ConstrainedEnumModel,
  ConstrainedEnumValueModel
} from '../../../models';
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
  public async defaultSelf(): Promise<string> {
    const doc = this.renderCommentForEnumType(this.model.name, this.model.type);
    const enumValues = await this.renderItems();
    const valuesToEnumMap = this.model.values.map((value) => {
      return `${this.model.name}Values[${value.key}]: ${value.key},`;
    });
    const additionalContent = await this.runAdditionalContentPreset();

    const values = this.model.values
      .map((value) => {
        return value.value;
      })
      .join(',');

    return `${doc}
type ${this.model.name} uint

const (
${this.indent(enumValues)}
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
${this.indent(this.renderBlock(valuesToEnumMap))}
}
${additionalContent}`;
  }

  async renderItems(): Promise<string> {
    const enums = this.model.values || [];
    const items: string[] = [];

    for (const [index, item] of enums.entries()) {
      const renderedItem = await this.runItemPreset(item, index);
      items.push(renderedItem);
    }

    return this.renderBlock(items);
  }

  renderCommentForEnumType(name: string, type: string): string {
    const globalType = type === 'interface{}' ? 'mixed types' : type;
    return this.renderComments(`${name} represents an enum of ${globalType}.`);
  }

  runItemPreset(
    item: ConstrainedEnumValueModel,
    index: number
  ): Promise<string> {
    return this.runPreset('item', { item, index });
  }
}

export const GO_DEFAULT_ENUM_PRESET: EnumPresetType<GoOptions> = {
  self({ renderer }) {
    return renderer.defaultSelf();
  },
  item({ model, item, index }) {
    if (index === 0) {
      return `${item.key} ${model.name} = iota`;
    }
    if (typeof item.value === 'string') {
      return item.key;
    }
    return item.key;
  }
};
