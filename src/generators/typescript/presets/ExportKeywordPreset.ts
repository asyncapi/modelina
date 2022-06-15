import { TypeScriptPreset } from '../TypeScriptPreset';

const renderWithExportKeyword = ({
  content,
}: {
  content: string;
}): string => `export ${content}`;

/**
 * Preset which adds export keyword wherever applicable (named exports)
 *
 * @implements {TypeScriptPreset}
 */
export const TS_EXPORT_KEYWORD_PRESET: TypeScriptPreset = {
  class: {
    self({ content }) {
      return renderWithExportKeyword({ content });
    },
  },
  interface: {
    self({ content }) {
      return renderWithExportKeyword({ content });
    },
  },
  type: {
    self({ content }) {
      return renderWithExportKeyword({ content });
    },
  },
  enum: {
    self({ content }) {
      return renderWithExportKeyword({ content });
    },
  },
};
