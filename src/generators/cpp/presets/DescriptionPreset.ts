import { CppPreset } from '../CppPreset';

/**
 * Preset which adds description to rendered model. 
 * 
 * @implements {CppPreset}
 */
const renderedDesc = 'my description';
export const CPP_DESCRIPTION_PRESET: CppPreset = {
  
  class: {
    self({ content }) {
      return `${renderedDesc}\n${content}`;
    },
    getter({ content }) {
      return `${renderedDesc}\n${content}`;
    }
  },
  enum: {
    self({ content }) {
      return `${renderedDesc}\n${content}`;
    },
  }
};
