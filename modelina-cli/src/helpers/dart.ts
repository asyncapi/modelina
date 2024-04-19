import { DartFileGenerator } from "@asyncapi/modelina";

export const DartOclifFlags = {

}

/**
 * This function builds all the relevant information for the main generate command
 */
export function buildDartGenerator(flags: any) {
  const { packageName } = flags;
  let presets = undefined
  if (packageName === undefined) {
    throw new Error('In order to generate models to Dart, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
  }

  const fileGenerator = new DartFileGenerator();
  const fileOptions = {
    packageName
  };
  return {
    presets,
    fileOptions,
    fileGenerator
  };
}