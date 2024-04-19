import { ScalaFileGenerator } from "@asyncapi/modelina";

export const ScalaOclifFlags = {

}

/**
 * This function builds all the relevant information for the main generate command
 */
export function buildScalaGenerator(flags: any) {
  const { packageName } = flags;
  if (packageName === undefined) {
    throw new Error('In order to generate models to Scala, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
  }

  const fileGenerator = new ScalaFileGenerator();
  const fileOptions = {
    packageName
  };
  return {
    fileOptions,
    fileGenerator
  };
}