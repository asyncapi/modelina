import { PhpPreset } from '../PhpPreset';

/**
 * Preset which adds description to rendered model. 
 * 
 * @implements {PhpPreset}
 */
export const Php_DESCRIPTION_PRESET: PhpPreset = {
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
