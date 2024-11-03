import { GO_DESCRIPTION_PRESET, GoFileGenerator } from "@asyncapi/modelina";
import { BuilderReturnType } from "./generate";
import { Flags } from "@oclif/core";

export const GoOclifFlags = {
  goIncludeComments: Flags.boolean({
    description: 'Golang specific, if enabled add comments while generating models.',
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
  const { packageName, goIncludeComments } = flags;

  if (packageName === undefined) {
    throw new Error('In order to generate models to Go, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
  }
  const presets = []
  if (goIncludeComments) { presets.push(GO_DESCRIPTION_PRESET); }
  const fileGenerator = new GoFileGenerator({ presets });
  const fileOptions = {
    packageName
  };
  return {
    fileOptions,
    fileGenerator
  };
}