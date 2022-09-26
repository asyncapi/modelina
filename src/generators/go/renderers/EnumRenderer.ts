import { GoRenderer } from '../GoRenderer';
import { ConstrainedEnumModel, ConstrainedEnumValueModel } from '../../../models';
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

    const slices: string[] = [];
    const maps: string[] = [];
    const scalars = this.model.values.filter((value, key) => {    
      const originalType = this.model.originalInput.enum[key];
      if (typeof originalType === "object") {
        if (Array.isArray(originalType)) {
          slices.push(`${value.key}: ${value.value}`);
        } else {
          maps.push(`${value.key}: ${value.value}`);
        }
        
        return false;
      }
      
      return true; 
    }).map((value) => {
      return `${this.model.name}Values[${value.key}]: ${value.key},`;
    });


    const values = this.model.values.map((value) => {
      return value.value;
    }).join(',');

    return `${doc}
type ${this.model.name} uint

const (
${this.indent(this.renderBlock(enumValues))}
)

// UnmarshalJSON implements json.Unmarshaler interface.
func (op *${this.model.name}) UnmarshalJSON(raw []byte) error {
  var v any
  if err := json.Unmarshal(raw, &v); err != nil {
    return err
  }
  *op = ValuesTo${this.model.name}[v]
  return nil
}

// Value returns the value of the enum.
func (op ${this.model.name}) Value() any {
	if op >= ${this.model.name}(len(${this.model.name}Values)) {
		return nil
	}
	return ${this.model.name}Values[op]
}

var ${this.model.name}Values = []any{${values}}
var ScalarValuesTo${this.model.name} = map[any]${this.model.name}{
${this.indent(this.renderBlock(scalars))}
}
var ${this.model.name}ToMapValues = map[${this.model.name}]
  ${this.indent(this.renderBlock(maps))}
}
var ${this.model.name}ToSliceValues = map[${this.model.name}]
  ${this.indent(this.renderBlock(slices))}
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
