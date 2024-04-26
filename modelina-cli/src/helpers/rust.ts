import { RustFileGenerator } from "@asyncapi/modelina";
import { BuilderReturnType } from "./generate";

export const RustOclifFlags = { }

/**
 * This function builds all the relevant information for the main generate command
 * 
 * @param flags 
 * @returns 
 */
export function buildRustGenerator(flags: any): BuilderReturnType {
  const fileGenerator = new RustFileGenerator();
  const fileOptions = undefined;
  return {
    fileOptions,
    fileGenerator
  };
}