import type { GoOptions } from '@/../../';
import {
  goDefaultEnumKeyConstraints,
  goDefaultModelNameConstraints,
  goDefaultPropertyKeyConstraints,
  GoGenerator
} from '@/../../';
import type { DeepPartial } from '@/../../lib/types/utils';

import type { ModelinaGoOptions, ModelProps } from '@/types';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';

/**
 * This is the server side part of the Go generator, that takes input and generator parameters and generate the models.
 */
export async function getGoModels(input: any, generatorOptions: ModelinaGoOptions): Promise<ModelProps[]> {
  const options: DeepPartial<GoOptions> = {
    presets: []
  };

  applyGeneralOptions(
    generatorOptions,
    options,
    goDefaultEnumKeyConstraints,
    goDefaultPropertyKeyConstraints,
    goDefaultModelNameConstraints
  );

  if (generatorOptions.showTypeMappingExample) {
    options.typeMapping = {
      Integer: ({ dependencyManager }) => {
        dependencyManager.addDependency('parent "family/father"');

        return 'int64';
      }
    };
  }

  try {
    const generator = new GoGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {
      packageName: generatorOptions.goPackageName || 'asyncapi.models'
    });

    return convertModelsToProps(generatedModels);
  } catch (e: any) {
    console.error('Could not generate models');
    console.error(e);

    return e.message;
  }
}
