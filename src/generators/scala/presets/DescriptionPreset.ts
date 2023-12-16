import { ScalaPreset } from '../ScalaPreset';

/**
 * Preset which adds description to rendered model.
 *
 * @implements {ScalaPreset}
 */
export const SCALA_DESCRIPTION_PRESET: ScalaPreset = {
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
    }
  }
};
