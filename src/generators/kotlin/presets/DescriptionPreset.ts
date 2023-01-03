import { KotlinPreset } from '../KotlinPreset';

/**
 * Preset which adds description to rendered model. 
 * 
 * @implements {KotlinPreset}
 */
export const KOTLIN_DESCRIPTION_PRESET: KotlinPreset = {
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
