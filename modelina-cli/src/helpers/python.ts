import { Flags } from "@oclif/core";
import { PYTHON_PYDANTIC_PRESET, PYTHON_PYDANTIC_TYPE_MAPPING, PythonFileGenerator, PythonPreset} from "@asyncapi/modelina";
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
  
  const presets: PythonPreset[] = [];
  let options;

  if (pyDantic) {
    presets.push(PYTHON_PYDANTIC_PRESET);
    const typeMapping = PYTHON_PYDANTIC_TYPE_MAPPING;
    options = {presets, typeMapping};
  } else {
    options = {presets};
  }

  const fileGenerator = new PythonFileGenerator(options);
  const fileOptions = {
    packageName
  };
  return {
    fileOptions,
    fileGenerator
  };
}
