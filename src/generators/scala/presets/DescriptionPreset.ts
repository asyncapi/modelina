import { ScalaRenderer } from '../ScalaRenderer';
import { ScalaPreset } from '../ScalaPreset';
import { FormatHelpers } from '../../../helpers';
import { ConstrainedEnumModel, ConstrainedObjectModel } from '../../../models';
function renderDescription({
  renderer,
  content,
  item
}: {
  renderer: ScalaRenderer<any>;
  content: string;
  item: ConstrainedObjectModel | ConstrainedEnumModel;
}): string {
  if (!item.originalInput['description']) {
    return content;
  }

  let comment = `${item.originalInput['description']}`;

  if (item instanceof ConstrainedObjectModel) {
    const properties = Object.keys(item.properties)
      .map((key) => item.properties[`${key}`])
      .map((model) => {
        const property = `@property ${model.propertyName}`;
        const desc = model.property.originalInput['description'];

        return desc !== undefined ? `${property} ${desc}` : property;
      })
      .join('\n');

    comment += `\n\n${properties}`;
  }

  const examples = Array.isArray(item.originalInput['examples'])
    ? `Examples: \n${FormatHelpers.renderJSONExamples(
        item.originalInput['examples']
      )}`
    : null;

  if (examples !== null) {
    comment += `\n\n${examples}`;
  }

  return `${renderer.renderComments(comment)}\n${content}`;
}

/**
 * Preset which adds description to rendered model.
 *
 * @implements {ScalaPreset}
 */
export const SCALA_DESCRIPTION_PRESET: ScalaPreset = {
  class: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    }
  },
  enum: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    }
  }
};
