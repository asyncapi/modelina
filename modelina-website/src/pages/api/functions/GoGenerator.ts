/* eslint-disable @typescript-eslint/no-unused-vars */
import { GoGenerator, GoOptions, goDefaultEnumKeyConstraints, goDefaultModelNameConstraints, goDefaultPropertyKeyConstraints } from '../../../../../';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';
import { ModelinaGoOptions, ModelProps } from '../../../types';
import { DeepPartial } from '../../../../../lib/types/utils';

/**
 * This is the server side part of the Go generator, that takes input and generator parameters and generate the models.
 */
export async function getGoModels(
  input: any,
  generatorOptions: ModelinaGoOptions
): Promise<ModelProps[]> {
  const options: DeepPartial<GoOptions> = {
    presets: []
  };
  applyGeneralOptions(generatorOptions, options, goDefaultEnumKeyConstraints, goDefaultPropertyKeyConstraints, goDefaultModelNameConstraints);

  if (generatorOptions.showTypeMappingExample) {
    options.typeMapping = {
      Integer: ({ dependencyManager }) => {
        dependencyManager.addDependency('parent "family/father"');
        return 'int64';
      }
    }
  }

  try {
    const generator = new GoGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {
      packageName: 'asyncapi.models'
    });
    return convertModelsToProps(generatedModels);
  } catch (e : any) {
    console.error('Could not generate models');
    console.error(e);
    return e.message;
  }
}
