import { CommonModel } from "../../../models";
import { TypeScriptPreset } from "../TypeScriptPreset";
import { TypeScriptRenderer } from "../TypeScriptRenderer";

const renderDescription = ({
  renderer,
  content,
  item,
}: {
  renderer: TypeScriptRenderer;
  content: string;
  item: CommonModel;
}): string => {
  const desc = item.getFromOriginalInput("description")?.trim();
  const examples = item.getFromOriginalInput("examples");
  const formattedExamples = `@example ${
    examples?.join ? examples.join(", ") : examples
  }`;

  if (desc || examples) {
    const doc = renderer.renderComments(
      `${desc || ""}\n${examples ? formattedExamples : ""}`.trim()
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
    property({ renderer, property, content }) {
      return renderDescription({ renderer, content, item: property });
    }
  },
  interface: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    },
    property({ renderer, property, content }) {
      return renderDescription({ renderer, content, item: property });
    }
  },
  type: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    },
  },
  enum: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    },
  },
};
