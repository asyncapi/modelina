import { JavaRenderer } from '../JavaRenderer';
import { JavaPreset } from '../JavaPreset';
import { FormatHelpers } from '../../../helpers';
import { ConstrainedMetaModel } from '../../../models';
import { isDiscriminatorOrDictionary } from '../renderers/ClassRenderer';

function renderDescription({
  renderer,
  content,
  item
}: {
  renderer: JavaRenderer<any>;
  content: string;
  item: ConstrainedMetaModel;
}): string {
  let desc = item.originalInput['description'];
  const examples = item.originalInput['examples'];

  if (Array.isArray(examples)) {
    const renderedExamples = FormatHelpers.renderJSONExamples(examples);
    const exampleDesc = `Examples: ${renderedExamples}`;
    desc = desc ? `${desc}\n${exampleDesc}` : exampleDesc;
  }

  if (desc) {
    const renderedDesc = renderer.renderComments(desc);
    return `${renderedDesc}\n${content}`;
  }
  return content;
}

/**
 * Preset which adds description to rendered model.
 *
 * @implements {JavaPreset}
 */
export const JAVA_DESCRIPTION_PRESET: JavaPreset = {
  class: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    },
    getter({ renderer, property, content, model }) {
      if (
        model.options.isExtended &&
        isDiscriminatorOrDictionary(model, property)
      ) {
        return '';
      }

      return renderDescription({ renderer, content, item: property.property });
    }
  },
  enum: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    }
  }
};
