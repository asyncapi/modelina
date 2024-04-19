import { KotlinFileGenerator } from "@asyncapi/modelina";
import { BuilderReturnType } from "./generate";

export const KotlinOclifFlags = {

}

/**
 * This function builds all the relevant information for the main generate command
 */
export function buildKotlinGenerator(flags: any): BuilderReturnType {
  const { packageName } = flags;
  
  if (packageName === undefined) {
    throw new Error('In order to generate models to Kotlin, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
  }

  const fileGenerator = new KotlinFileGenerator();
  const fileOptions = {
    packageName
  };
  return {
    fileOptions,
    fileGenerator
  };
}