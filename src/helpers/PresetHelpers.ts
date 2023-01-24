import { Preset, Presets } from '../models';

/**
 * Returns true if and only if a given preset is already included in a list of presets
 * Check is done using referential equality
 * @param presets the list to check
 * @param preset the preset to check for
 */
export const hasPreset = <P extends Preset = Preset>(
  presets: Presets<P>,
  preset: P
): boolean =>
  presets.some(
    (presetListItem) =>
      // Check regular preset equality
      preset === presetListItem ||
      // Check PresetWithOptions equality
      (Object.prototype.hasOwnProperty.call(preset, 'preset') &&
        preset.preset === presetListItem)
  );
