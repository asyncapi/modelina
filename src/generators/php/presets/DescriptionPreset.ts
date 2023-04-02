import { PhpPreset } from '../PhpPreset';

/**
 * Preset which adds description to rendered model.
 *
 * @implements {PhpPreset}
 */

const DESC = 'my description';

export const PHP_DESCRIPTION_PRESET: PhpPreset = {
  class: {
    self({ content }) {
      return `//${DESC}\n${content}`;
    },
    getter({ content }) {
      return `//${DESC}\n${content}`;
    }
  },
  enum: {
    self({ content }) {
      return `//${DESC}\n${content}`;
    }
  }
};
