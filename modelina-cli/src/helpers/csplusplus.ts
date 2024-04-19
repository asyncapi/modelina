import { CplusplusFileGenerator } from "@asyncapi/modelina";
import { BuilderReturnType } from "./generate";

export const CplusplusOclifFlags = {

}

/**
 * This function builds all the relevant information for the main generate command
 */
export function buildCplusplusGenerator(flags: any): BuilderReturnType {
  const { namespace } = flags;
  if (namespace === undefined) {
    throw new Error('In order to generate models to C++, we need to know which namespace they are under. Add `--namespace=NAMESPACE` to set the desired namespace.');
  }

  const fileGenerator = new CplusplusFileGenerator({
    namespace
  });
  const fileOptions = undefined;
  return {
    fileOptions,
    fileGenerator
  };
}