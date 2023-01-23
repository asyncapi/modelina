import { Preset, PresetWithOptions } from '../models';

export function isPresetWithOptions(
  preset: Preset | PresetWithOptions
): preset is PresetWithOptions {
  return Object.prototype.hasOwnProperty.call(preset, 'preset');
}
