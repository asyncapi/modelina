import { PhpFileGenerator } from "@asyncapi/modelina";

export const PhpOclifFlags = { }

/**
 * This function builds all the relevant information for the main generate command
 * 
 * @param flags 
 * @returns 
 */
export function buildPhpGenerator(flags: any) {
  const { namespace } = flags;
  
  if (namespace === undefined) {
    throw new Error('In order to generate models to PHP, we need to know which namespace they are under. Add `--namespace=NAMESPACE` to set the desired namespace.');
  }

  const fileGenerator = new PhpFileGenerator();
  const fileOptions = {
    namespace
  };
  return {
    fileOptions,
    fileGenerator
  };
}