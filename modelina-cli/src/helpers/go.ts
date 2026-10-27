import { GO_DESCRIPTION_PRESET, GO_COMMON_PRESET, GoCommonPresetOptions, GoFileGenerator } from "@asyncapi/modelina";
import { BuilderReturnType } from "./generate";
import { Flags } from "@oclif/core";

export const GoOclifFlags = {
  goIncludeComments: Flags.boolean({
    description: 'Golang specific, if enabled add comments while generating models.',
    required: false,
    default: false,
  }),
  goIncludeTags: Flags.boolean({
    description: 'Golang specific, if enabled add tags while generating models.',
    required: false,
    default: false,
  }),
  goUsePointersForOptionalFields: Flags.boolean({
    description: 'Golang specific, render optional value fields as pointers.',
    required: false,
    default: false,
  }),
  goUseTimeForDateTime: Flags.boolean({
    description: 'Golang specific, map date-time string fields to time.Time.',
    required: false,
    default: false,
  }),
}

/**
 * This function builds all the relevant information for the main generate command
 * 
 * @param flags 
 * @returns 
 */
export function buildGoGenerator(flags: any): BuilderReturnType {
  const {
    packageName,
    goIncludeComments,
    goIncludeTags,
    goUsePointersForOptionalFields,
    goUseTimeForDateTime,
  } = flags;

  if (packageName === undefined) {
    throw new Error('In order to generate models to Go, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
  }

  const presets = []
  if (goIncludeTags) {
    const options: GoCommonPresetOptions = { addJsonTag: true };
    presets.push({ preset: GO_COMMON_PRESET, options })
  }

  if (goIncludeComments) { presets.push(GO_DESCRIPTION_PRESET); }
  const generatorOptions = {
    presets,
    usePointersForOptionalFields: Boolean(goUsePointersForOptionalFields),
    useTimeForDateTime: Boolean(goUseTimeForDateTime),
  };
  const fileGenerator = new GoFileGenerator(generatorOptions);
  const fileOptions = {
    packageName
  };
  return {
    fileOptions,
    fileGenerator
  };
}