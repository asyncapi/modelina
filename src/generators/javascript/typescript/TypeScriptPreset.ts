import { Preset, ClassPreset, InterfacePreset, EnumPreset, CommonPreset } from "../../../models";

import { ClassRenderer } from "./renderers/ClassRenderer";
import { InterfaceRenderer } from "./renderers/InterfaceRenderer";
import { EnumRenderer } from "./renderers/EnumRenderer";
import { TypeRenderer } from "./renderers/TypeRenderer";

export interface TypePreset extends CommonPreset<TypeRenderer> {}

export type TypeScriptPreset = Preset<{
  class: ClassPreset<ClassRenderer>;
  interface: InterfacePreset<InterfaceRenderer>;
  enum: EnumPreset<EnumRenderer>;
  type: TypePreset;
}>;

export const TS_DEFAULT_PRESET: TypeScriptPreset = {
  class: {
    self({ renderer }) {
      return renderer.render();
    },
  },
  interface: {
    self({ renderer }) {
      return renderer.render();
    },
  },
  enum: {
    self({ renderer }) {
      return renderer.render();
    },
  },
  type: {
    self({ renderer }) {
      return renderer.render();
    },
  },
};
