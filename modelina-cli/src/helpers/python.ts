import { PythonFileGenerator } from "@asyncapi/modelina";
import { BuilderReturnType } from "./generate";

export const PythonOclifFlags = { }

/**
 * This function builds all the relevant information for the main generate command
 * 
 * @param flags 
 * @returns 
 */
export function buildPythonGenerator(flags: any): BuilderReturnType {
  const fileGenerator = new PythonFileGenerator();
  const fileOptions = undefined;
  return {
    fileOptions,
    fileGenerator
  };
}