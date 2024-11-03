import { ConstrainedMetaModel } from '../../../models';
import { GoPreset } from '../GoPreset';
import { GoRenderer } from '../GoRenderer';

const renderDescription = ({
  renderer,
  content,
  item
}: {
  renderer: GoRenderer<ConstrainedMetaModel>;
  content: string;
  item: ConstrainedMetaModel;
}): string => {
  const desc = item.originalInput.description?.trim();
  let formattedDesc = '';
  if (desc) {
    formattedDesc = renderer.renderComments(desc);
    formattedDesc += '\n';
  }
  return formattedDesc + content;
};

/**
 * Preset which adds descriptions
 *
 * @implements {GoPreset}
 */
export const GO_DESCRIPTION_PRESET: GoPreset = {
  struct: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    },
    field({ renderer, field, content }) {
      return renderDescription({ renderer, content, item: field.property });
    }
  },
  enum: {
    self({ renderer, model, content }) {
      return renderDescription({ renderer, content, item: model });
    }
  }
};
