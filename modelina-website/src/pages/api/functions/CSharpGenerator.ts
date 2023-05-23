/* eslint-disable @typescript-eslint/no-unused-vars */
import { CSharpGenerator, CSharpOptions } from '../../../../../';
import { convertModelsToProps } from './Helpers';
import { ModelinaCSharpOptions, ModelProps } from '../../../types';
import {CSHARP_COMMON_PRESET} from '../../../../../';

/**
 * This is the server side part of the CSharp generator, that takes input and generator parameters and generate the models.
 */
export async function getCSharpModels(
  input: any,
  generatorOptions: ModelinaCSharpOptions
): Promise<ModelProps[]> {
  const options: Partial<CSharpOptions> = {
    presets: []
  };

  if (generatorOptions.csharpArrayType) {
    options.collectionType = generatorOptions.csharpArrayType as any;
    options.autoImplementedProperties = generatorOptions.csharpAutoImplemented;
  }
  if (generatorOptions.csharpOverwriteHashcode) {
    options.presets = [
      {
        preset: CSHARP_COMMON_PRESET,
        options: {
          equal: false,
          hashCode: generatorOptions.csharpOverwriteHashcode
        }
      }
    ]
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
