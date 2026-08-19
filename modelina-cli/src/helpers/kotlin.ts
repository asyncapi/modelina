import {
  KOTLIN_JACKSON_PRESET,
  KotlinFileGenerator,
  KotlinGenerator,
  KotlinTypeMapping
} from "@asyncapi/modelina";
import { Flags } from "@oclif/core";
import { BuilderReturnType } from "./generate";

export const KotlinOclifFlags = {
  kotlinAllowInheritance: Flags.boolean({
    description: 'Kotlin specific, generate interfaces for inherited schemas',
    required: false,
    default: false
  }),
  kotlinJackson: Flags.boolean({
    description: 'Kotlin specific, generate the models with Jackson serialization support',
    required: false,
    default: false
  }),
  kotlinIgnoreAdditionalProperties: Flags.boolean({
    description: 'Kotlin specific, omit additionalProperties from generated models',
    required: false,
    default: false
  }),
  kotlinIncludeComponentSchemas: Flags.boolean({
    description: 'Kotlin specific, generate every schema in components/schemas',
    required: false,
    default: false
  }),
  kotlinRequiredPropertiesFirst: Flags.boolean({
    description: 'Kotlin specific, render required constructor properties before optional properties',
    required: false,
    default: false
  }),
  kotlinTypeMapping: Flags.string({
    description: 'Kotlin specific, map a string format to a Kotlin type, for example uuid=java.util.UUID',
    multiple: true,
    required: false
  })
}

/**
 * This function builds all the relevant information for the main generate command
 * 
 * @param flags 
 * @returns 
 */
export function buildKotlinGenerator(flags: any): BuilderReturnType {
  const {
    packageName,
    kotlinAllowInheritance,
    kotlinJackson,
    kotlinIgnoreAdditionalProperties,
    kotlinIncludeComponentSchemas,
    kotlinRequiredPropertiesFirst = false,
    kotlinTypeMapping
  } = flags;
  const presets = [];
  
  if (packageName === undefined) {
    throw new Error('In order to generate models to Kotlin, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
  }

  if (kotlinJackson) { presets.push(KOTLIN_JACKSON_PRESET); }

  const formatMappings = parseKotlinTypeMappings(kotlinTypeMapping);
  const typeMapping: Partial<KotlinTypeMapping> = {};
  if (formatMappings.size > 0) {
    typeMapping.String = (context) => {
      const format = context.constrainedModel.options.format;
      return formatMappings.get(format || '') ||
        KotlinGenerator.defaultOptions.typeMapping.String(context);
    };
  }

  const fileGenerator = new KotlinFileGenerator({
    presets,
    requiredPropertiesFirst: kotlinRequiredPropertiesFirst,
    typeMapping,
    processorOptions: {
      asyncapi: {
        includeComponentSchemas: kotlinIncludeComponentSchemas
      },
      jsonSchema: {
        allowInheritance: kotlinAllowInheritance,
        ignoreAdditionalProperties: kotlinIgnoreAdditionalProperties
      }
    }
  });
  const fileOptions = {
    packageName
  };
  return {
    fileOptions,
    fileGenerator
  };
}

function parseKotlinTypeMappings(mappings?: string[]): Map<string, string> {
  const parsedMappings = new Map<string, string>();
  for (const mapping of mappings || []) {
    const separatorIndex = mapping.indexOf('=');
    if (separatorIndex <= 0 || separatorIndex === mapping.length - 1) {
      throw new Error(
        `Invalid Kotlin type mapping '${mapping}'. Expected FORMAT=KOTLIN_TYPE.`
      );
    }

    parsedMappings.set(
      mapping.slice(0, separatorIndex),
      mapping.slice(separatorIndex + 1)
    );
  }

  return parsedMappings;
}
