import { Preset, ClassPreset, EnumPreset } from "../../models";

import { ClassRenderer } from "./renderers/ClassRenderer";
import { EnumRenderer } from "./renderers/EnumRenderer";

export type JavaPreset = Preset<{
  class: ClassPreset<ClassRenderer>;
  enum: EnumPreset<EnumRenderer>;
}>;

export const JAVA_DEFAULT_PRESET: JavaPreset = {
  class: {
    self({ renderer }) {
      return renderer.render();
    },
  },
  enum: {
    self({ renderer }) {
      return renderer.render();
    },
  },
};
