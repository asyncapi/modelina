import { CSHARP_COMMON_PRESET, CSHARP_JSON_SERIALIZER_PRESET, CSHARP_NEWTONSOFT_SERIALIZER_PRESET, CSharpFileGenerator } from "@asyncapi/modelina";
import { Flags } from "@oclif/core";
import { BuilderReturnType } from "./generate";

export const CSharpOclifFlags = {
  csharpAutoImplement: Flags.boolean({
    description: 'C# specific, define whether to generate auto-implemented properties or not.',
    required: false,
    default: false
  }),
  csharpNewtonsoft: Flags.boolean({
    description: 'C# specific, generate the models with newtonsoft serialization support',
    required: false,
    default: false
  }),
  csharpArrayType: Flags.string({
    type: 'option',
    description: 'C# specific, define which type of array needs to be generated.',
    options: ['Array', 'List'],
    required: false,
    default: 'Array'
  }),
  csharpHashcode: Flags.boolean({
    description: 'C# specific, generate the models with the GetHashCode method overwritten',
    required: false,
    default: false
  }),
  csharpEqual: Flags.boolean({
    description: 'C# specific, generate the models with the Equal method overwritten',
    required: false,
    default: false
  }),
  csharpSystemJson: Flags.boolean({
    description: 'C# specific, generate the models with System.Text.Json serialization support',
    required: false,
    default: false
  }),
}

/**
 * This function builds all the relevant information for the main generate command
 */
export function buildCSharpGenerator(flags: any): BuilderReturnType {
  const { namespace, csharpAutoImplement, csharpArrayType, csharpNewtonsoft, csharpHashcode, csharpEqual, csharpSystemJson } = flags;
  let presets = [];

  if (namespace === undefined) {
    throw new Error('In order to generate models to C#, we need to know which namespace they are under. Add `--namespace=NAMESPACE` to set the desired namespace.');
  }

  if (csharpNewtonsoft) {
    presets.push(CSHARP_NEWTONSOFT_SERIALIZER_PRESET);
  }

  if (csharpSystemJson) {
    presets.push(CSHARP_JSON_SERIALIZER_PRESET);
  }

  if (csharpHashcode || csharpEqual) {
    presets.push({
      preset: CSHARP_COMMON_PRESET,
      options: {
        hashCode: csharpHashcode,
        equals: csharpEqual
      }
    });
  }

  const fileGenerator = new CSharpFileGenerator({
    presets,
    collectionType: csharpArrayType as 'Array' | 'List',
    autoImplementedProperties: csharpAutoImplement
  });

  const fileOptions = {
    namespace
  };
  return {
    fileOptions,
    fileGenerator
  };
}