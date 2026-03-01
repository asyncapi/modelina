import { TypeScriptPreset } from '../TypeScriptPreset';
import renderExampleFunction from './utils/ExampleFunction';
import { renderFromJson, renderUnmarshal } from './utils/UnmarshalFunction';
import { renderMarshal, renderToJson } from './utils/MarshalFunction';

export interface TypeScriptCommonPresetOptions {
  marshalling: boolean;
  example: boolean;
}

/**
 * Preset which adds `toJson`, `marshal`, `fromJson`, `unmarshal`, `example` functions to class.
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
          blocks.push(renderToJson({ renderer, model }));
          blocks.push(renderMarshal());
          blocks.push(renderFromJson({ renderer, model }));
          blocks.push(renderUnmarshal({ renderer, model }));
        }

        if (options.example === true) {
          blocks.push(renderExampleFunction({ model }));
        }

        return renderer.renderBlock([content, ...blocks], 2);
      }
    }
  };
