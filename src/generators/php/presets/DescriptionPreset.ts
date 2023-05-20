import { PhpPreset } from '../PhpPreset';
import { ConstrainedEnumModel, ConstrainedObjectModel } from '../../../models';

function renderDescription({
  content,
  model
}: {
  content: string;
  model: ConstrainedObjectModel | ConstrainedEnumModel;
}): string {
  if (!model.originalInput['description']) {
    return content;
  }

  const description = model.originalInput['description'];

  return `/**
 * ${description}
 */
${content}`;
}

/**
 * Preset which adds description to rendered model.
 *
 * @implements {PhpPreset}
 */

export const PHP_DESCRIPTION_PRESET: PhpPreset = {
  class: {
    self({ content, model }) {
      return renderDescription({ content, model });
    }
  },
  enum: {
    self({ content, model }) {
      return renderDescription({ content, model });
    }
  }
};
