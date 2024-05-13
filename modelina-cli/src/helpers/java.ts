import { JAVA_COMMON_PRESET, JAVA_CONSTRAINTS_PRESET, JAVA_DESCRIPTION_PRESET, JAVA_JACKSON_PRESET, JavaFileGenerator } from "@asyncapi/modelina";
import { Flags } from "@oclif/core";
import { BuilderReturnType } from "./generate";

export const JavaOclifFlags = {
  javaIncludeComments: Flags.boolean({
    description: 'Java specific, if enabled add comments while generating models.',
    required: false,
    default: false
  }),
  javaJackson: Flags.boolean({
    description: 'Java specific, generate the models with Jackson serialization support',
    required: false,
    default: false
  }),
  javaConstraints: Flags.boolean({
    description: 'Java specific, generate the models with constraints',
    required: false,
    default: false
  }),
}

/**
 * This function builds all the relevant information for the main generate command
 * 
 * @param flags 
 * @returns 
 */
export function buildJavaGenerator(flags: any): BuilderReturnType {
  const { packageName, javaIncludeComments, javaJackson, javaConstraints } = flags;
  const presets = []
  
  if (packageName === undefined) {
    throw new Error('In order to generate models to Java, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
  }

  presets.push({
    preset: JAVA_COMMON_PRESET,
  });
  if (javaIncludeComments) {presets.push(JAVA_DESCRIPTION_PRESET);}
  if (javaJackson) {presets.push(JAVA_JACKSON_PRESET);}
  if (javaConstraints) {presets.push(JAVA_CONSTRAINTS_PRESET);}
  const fileGenerator = new JavaFileGenerator({ presets });
  const fileOptions = {
    packageName
  };
  return {
    fileOptions,
    fileGenerator
  };
}