/* eslint-disable @typescript-eslint/no-unused-vars */
import { CSharpGenerator, CSharpOptions, csharpDefaultEnumKeyConstraints, csharpDefaultModelNameConstraints, csharpDefaultPropertyKeyConstraints } from '../../../../../';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';
import { ModelinaCSharpOptions, ModelProps } from '../../../types';
import { DeepPartial } from '../../../../../lib/types/utils';
import { CSHARP_COMMON_PRESET, CSHARP_JSON_SERIALIZER_PRESET, CSHARP_NEWTONSOFT_SERIALIZER_PRESET } from '../../../../../';

/**
 * This is the server side part of the CSharp generator, that takes input and generator parameters and generate the models.
 */
export async function getCSharpModels(
  input: any,
  generatorOptions: ModelinaCSharpOptions
): Promise<ModelProps[]> {
  const options: DeepPartial<CSharpOptions> = {
    presets: []
  };

  applyGeneralOptions(generatorOptions, options, csharpDefaultEnumKeyConstraints, csharpDefaultPropertyKeyConstraints, csharpDefaultModelNameConstraints);

  if (generatorOptions.csharpArrayType) {
    options.collectionType = generatorOptions.csharpArrayType;
  }

  if (generatorOptions.csharpAutoImplemented) {
    options.autoImplementedProperties = generatorOptions.csharpAutoImplemented;
  }
  if (generatorOptions.csharpOverwriteHashcode) {
    options.presets?.push({
      preset: CSHARP_COMMON_PRESET,
      options: {
        equal: false,
        hashCode: generatorOptions.csharpOverwriteHashcode
      }
    })
  }
  if (generatorOptions.csharpIncludeJson) {
    options.presets?.push(CSHARP_JSON_SERIALIZER_PRESET)
  }

  if(generatorOptions.csharpOverwriteEqual){
    options.presets.push({
      preset: CSHARP_COMMON_PRESET,
      options: {
        equal: generatorOptions.csharpOverwriteEqual,
        hashCode: true
      }
    })
  }  
  if (generatorOptions.csharpIncludeNewtonsoft) {
    options.presets?.push(CSHARP_NEWTONSOFT_SERIALIZER_PRESET)
  }

  if (generatorOptions.showTypeMappingExample) {
    options.typeMapping = {
      Integer: ({ dependencyManager }) => {
        dependencyManager.addDependency('using My.Namespace;');
        return 'MyIntegerType';
      }
    }
  }

  try {
    const generator = new CSharpGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {
      namespace: 'asyncapi.models'
    });
    return convertModelsToProps(generatedModels);
  } catch (e : any) {
    console.error('Could not generate models');
    console.error(e);
    return e.message;
  }
}
