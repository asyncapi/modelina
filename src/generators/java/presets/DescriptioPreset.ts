import { JavaRenderer } from '../JavaRenderer';
import { JavaPreset } from '../JavaPreset';
import { FormatHelpers } from '../../../helpers';
import { CommonModel } from '../../../models';

function renderDescription({ renderer, content, item }: {
  renderer: JavaRenderer,
  content: string,
  item: CommonModel,
}): string {
  let desc = item.getFromSchema('description');
  const examples = item.getFromSchema('examples');

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
    getter({ renderer, property, content }) {
      return renderDescription({ renderer, content, item: property });
    }
  },
  enum: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    },
  }
};
