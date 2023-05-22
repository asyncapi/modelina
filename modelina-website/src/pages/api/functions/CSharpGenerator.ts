/* eslint-disable @typescript-eslint/no-unused-vars */
import { CSharpGenerator, CSharpOptions, csharpDefaultEnumKeyConstraints, csharpDefaultModelNameConstraints, csharpDefaultPropertyKeyConstraints } from '../../../../../';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';
import { ModelinaCSharpOptions, ModelProps } from '../../../types';
import { DeepPartial } from '../../../../../lib/types/utils';

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
