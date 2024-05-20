import { GoPreset } from '../GoPreset';
import { GoRenderer } from '../GoRenderer';
import {
  ConstrainedDictionaryModel,
  ConstrainedObjectPropertyModel,
  ConstrainedEnumModel
} from '../../../models';

export interface GoCommonPresetOptions {
  addJsonTag: boolean;
  addOmitEmpty?: boolean;
}

function renderJSONTag({
  field,
  omitempty
}: {
  field: ConstrainedObjectPropertyModel;
  omitempty?: boolean;
}): string {
  if (
    field.property instanceof ConstrainedDictionaryModel &&
    field.property.serializationType === 'unwrap'
  ) {
    return `json:"-"`;
  }
  return `json:"${field.unconstrainedPropertyName}${
    omitempty ? ', omitempty' : ''
  }"`;
}

function renderMarshallingFunctions({
  model,
  renderer
}: {
  model: ConstrainedEnumModel;
  renderer: GoRenderer<any>;
}): string {
  renderer.dependencyManager.addDependency('encoding/json');
  return `
func (op *${model.name}) UnmarshalJSON(raw []byte) error {
  var v any
  if err := json.Unmarshal(raw, &v); err != nil {
  return err
  }
  *op = ValuesTo${model.name}[v]
  return nil
}

func (op ${model.name}) MarshalJSON() ([]byte, error) {
  return json.Marshal(op.Value())
}`;
}

export const GO_COMMON_PRESET: GoPreset<GoCommonPresetOptions> = {
  struct: {
    field: ({ content, field, options }) => {
      const blocks: string[] = [];
      if (options.addJsonTag) {
        blocks.push(renderJSONTag({ field, omitempty: options.addOmitEmpty }));
      }
      return `${content} \`${blocks.join(' ')}\``;
    }
  },
  enum: {
    additionalContent({ content, model, renderer, options }) {
      const blocks: string[] = [];
      if (options.addJsonTag) {
        blocks.push(renderMarshallingFunctions({ model, renderer }));
      }

      return `${content}\n ${blocks.join('\n')}`;
    }
  }
};
