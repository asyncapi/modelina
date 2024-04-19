import { JavaScriptFileGenerator } from "@asyncapi/modelina";
import { BuilderReturnType } from "./generate";

export const JavaScriptOclifFlags = {

}

/**
 * This function builds all the relevant information for the main generate command
 */
export function buildJavaScriptGenerator(flags: any): BuilderReturnType {
  const fileGenerator = new JavaScriptFileGenerator();
  const fileOptions = undefined;
  return {
    fileOptions,
    fileGenerator
  };
}