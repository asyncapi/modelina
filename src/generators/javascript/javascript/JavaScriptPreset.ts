import { Preset, ClassPreset } from "../../../models";

import { ClassRenderer } from "./renderers/ClassRenderer";

export type JavaScriptPreset = Preset<{
  class: ClassPreset<ClassRenderer>;
}>;

export const JS_DEFAULT_PRESET: JavaScriptPreset = {
  class: {
    self({ renderer }) {
      return renderer.render();
    },
  },
};
