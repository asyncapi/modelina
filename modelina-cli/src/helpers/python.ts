import { Flags } from "@oclif/core";
import { PYTHON_PYDANTIC_PRESET, PythonFileGenerator } from "@asyncapi/modelina";
import { BuilderReturnType } from "./generate";

export const PythonOclifFlags = {
  pyDantic: Flags.boolean({
    description: 'Python specific, generate the Pydantic models.',
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
export function buildPythonGenerator(flags: any): BuilderReturnType {
  const {packageName, pyDantic} = flags;

  if (packageName === undefined) {
    throw new Error('In order to generate models to Python, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
  }
  
  const presets = [];  
  if (pyDantic) {
    presets.push(PYTHON_PYDANTIC_PRESET);
  }

  const fileGenerator = new PythonFileGenerator({presets});
  const fileOptions = undefined;
  return {
    fileOptions,
    fileGenerator
  };
}
