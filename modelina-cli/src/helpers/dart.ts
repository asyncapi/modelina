import { DartFileGenerator } from "@asyncapi/modelina";
import { BuilderReturnType } from "./generate";

export const DartOclifFlags = { }


/**
 * This function builds all the relevant information for the main generate command
 * 
 * @param flags 
 * @returns 
 */
export function buildDartGenerator(flags: any): BuilderReturnType {
  const { packageName } = flags;
  if (packageName === undefined) {
    throw new Error('In order to generate models to Dart, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
  }

  const fileGenerator = new DartFileGenerator();
  const fileOptions = {
    packageName
  };
  return {
    fileOptions,
    fileGenerator
  };
}