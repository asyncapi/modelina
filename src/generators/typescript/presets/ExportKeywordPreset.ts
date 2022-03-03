import { CommonModel } from "../../../models";
import { TypeScriptPreset } from "../TypeScriptPreset";
import { TypeScriptRenderer } from "../TypeScriptRenderer";

const renderWithExportKeyword = ({
  content,
}: {
  renderer: TypeScriptRenderer;
  content: string;
  item: CommonModel;
}): string => `export ${content}`;


/**
 * Preset which adds export keyword wherever applicable (named exports)
 *
 * @implements {TypeScriptPreset}
 */
export const TS_EXPORT_KEYWORD_PRESET: TypeScriptPreset = {
  class: {
    self({ renderer, model, content }) {
      return renderWithExportKeyword({ renderer, content, item: model });
    },
  },
  interface: {
    self({ renderer, model, content }) {
      return renderWithExportKeyword({ renderer, content, item: model });
    },
  },
  type: {
    self({ renderer, model, content }) {
      return renderWithExportKeyword({ renderer, content, item: model });
    },
  },
  enum: {
    self({ renderer, model, content }) {
      return renderWithExportKeyword({ renderer, content, item: model });
    },
  },
};
