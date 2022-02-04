import { DartRenderer } from '../DartRenderer';
import { DartPreset } from '../DartPreset';
import { FormatHelpers } from '../../../helpers';
import { CommonModel } from '../../../models';

function renderDescription({ renderer, content, item }: {
  renderer: DartRenderer,
  content: string,
  item: CommonModel,
}): string {
  let desc = item.getFromOriginalInput('description');
  const examples = item.getFromOriginalInput('examples');

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
export const DART_DESCRIPTION_PRESET: DartPreset = {
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
