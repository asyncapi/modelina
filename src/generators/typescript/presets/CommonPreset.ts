import { TypeScriptPreset } from '../TypeScriptPreset';
import renderExampleFunction from './utils/ExampleFunction';
import { renderUnmarshal } from './utils/UnmarshalFunction';
import { renderMarshal } from './utils/MarshalFunction';

export interface TypeScriptCommonPresetOptions {
  marshalling: boolean;
  example: boolean;
}

/**
 * Preset which adds `marshal`, `unmarshal`, `example` functions to class.
 *
 * @implements {TypeScriptPreset}
 */
export const TS_COMMON_PRESET: TypeScriptPreset<TypeScriptCommonPresetOptions> =
  {
    class: {
      additionalContent({ renderer, model, content, options }) {
        options = options || {};
        const blocks: string[] = [];

        if (options.marshalling === true) {
          blocks.push(renderMarshal({ renderer, model }));
          blocks.push(renderUnmarshal({ renderer, model }));
        }

        if (options.example === true) {
          blocks.push(renderExampleFunction({ model }));
        }

        return renderer.renderBlock([content, ...blocks], 2);
      }
    }
  };
