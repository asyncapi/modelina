import { ConstrainedMetaModel } from '../../../models';
import { TypeScriptPreset } from '../TypeScriptPreset';
import { TypeScriptRenderer } from '../TypeScriptRenderer';

const renderDescription = ({
  renderer,
  content,
  item
}: {
  renderer: TypeScriptRenderer<ConstrainedMetaModel>;
  content: string;
  item: ConstrainedMetaModel;
}): string => {
  const desc = item.originalInput.description?.trim();
  const examples = item.originalInput.examples;
  const formattedExamples = `@example ${
    examples?.join ? examples.join(', ') : examples
  }`;

  if (desc || examples) {
    const doc = renderer.renderComments(
      `${desc || ''}\n${examples ? formattedExamples : ''}`.trim()
    );
    return `${doc}\n${content}`;
  }

  return content;
};

/**
 * Preset which adds descriptions
 *
 * @implements {TypeScriptPreset}
 */
export const TS_DESCRIPTION_PRESET: TypeScriptPreset = {
  class: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    },
    getter({ renderer, property, content }) {
      return renderDescription({ renderer, content, item: property.property });
    }
  },
  interface: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    },
    property({ renderer, property, content }) {
      return renderDescription({ renderer, content, item: property.property });
    }
  },
  type: {
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
