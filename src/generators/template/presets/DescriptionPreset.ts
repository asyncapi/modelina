import { TemplatePreset } from '../TemplatePreset';

/**
 * Preset which adds description to rendered model.
 *
 * @implements {TemplatePreset}
 */
export const TEMPLATE_DESCRIPTION_PRESET: TemplatePreset = {
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
