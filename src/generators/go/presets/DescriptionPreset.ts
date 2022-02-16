import { GoRenderer } from '../GoRenderer';
import { GoPreset } from '../GoPreset';
import { CommonModel } from '../../../models';
import { FieldType } from '../GoPreset';

function renderDescription({
  renderer,
  content,
  item
}: {
  renderer: GoRenderer;
  content: string;
  item: CommonModel;
}): string {
  const desc = item.getFromOriginalInput('description');

  if (desc) {
    const renderedDesc = renderer.renderComments(desc);
    return `${renderedDesc}\n${content}`;
  }

  return content;
}

export const GO_DESCRIPTION_PRESET: GoPreset = {
  struct: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    },
    field({ fieldName, field, renderer, type }) {
      fieldName = renderer.nameField(fieldName, field);
      let fieldType = renderer.renderType(field);
      if (
        type === FieldType.additionalProperty ||
        type === FieldType.patternProperties
      ) {
        fieldType = `map[string]${fieldType}`;
      }

      const content = `${fieldName} ${fieldType}`;

      return renderDescription({ renderer, content, item: field });
    }
  },
  enum: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    }
  }
};
