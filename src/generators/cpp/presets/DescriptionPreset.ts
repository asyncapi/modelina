import { CppPreset } from '../CppPreset';

/**
 * Preset which adds description to rendered model. 
 * 
 * @implements {CppPreset}
 */
export const CPP_DESCRIPTION_PRESET: CppPreset = {
  class: {
    self({ content }) {
      const renderedDesc = 'my description';
      return `${renderedDesc}\n${content}`;
    },
    getter({ content }) {
      const renderedDesc = 'my description';
      return `${renderedDesc}\n${content}`;
    }
  },
  enum: {
    self({ content }) {
      const renderedDesc = 'my description';
      return `${renderedDesc}\n${content}`;
    },
  }
};
