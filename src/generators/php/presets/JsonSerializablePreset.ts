import { PhpPreset } from '../PhpPreset';
import { PhpRenderer } from '../PhpRenderer';
import { ConstrainedMetaModel } from '../../../models';

function renderSelf({
  content
}: {
  content: string;
  renderer: PhpRenderer<ConstrainedMetaModel>;
}): string {
  const contentLines = content.split('\n');
  contentLines[0] += ` implements \\JsonSerializable`;

  return contentLines.join('\n');
}

/**
 * Preset, which implements PHP’s JsonSerializable interface.
 *
 * Using this will allow to json serialize the model using `json_encode()`.
 *
 * @implements {PhpPreset}
 */
export const PHP_JSON_SERIALIZABLE_PRESET: PhpPreset = {
  class: {
    self({ content, renderer }): string {
      return renderSelf({ content, renderer });
    },
    additionalContent({ renderer, model, content }): string {
      return (
        content +
        renderer.renderBlock([
          'public function jsonSerialize(): array',
          '{',
          renderer.indent(
            renderer.renderBlock([
              'return [',
              renderer.indent(
                renderer.renderBlock(
                  Object.values(model.properties).map((property) => {
                    if (property.propertyName === 'additionalProperties') {
                      return `...$this->${property.propertyName},`;
                    }

                    return `'${property.unconstrainedPropertyName}' => $this->${property.propertyName},`;
                  })
                )
              ),
              '];'
            ])
          ),
          '}'
        ])
      );
    }
  },
  enum: {
    self({ content, renderer }): string {
      return renderSelf({ content, renderer });
    },
    additionalContent({ content, model, renderer }) {
      return (
        content +
        renderer.renderBlock([
          `public function jsonSerialize(): mixed`,
          '{',
          renderer.indent(
            renderer.renderBlock([
              'return match($this) {',
              renderer.indent(
                renderer.renderBlock([
                  ...model.values.map(
                    (value) => `self::${value.key} => ${value.value},`
                  )
                ])
              ),
              '};'
            ])
          ),
          '}'
        ])
      );
    }
  }
};
