/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CplusplusOptions } from '@/./';
import {
  cplusplusDefaultEnumKeyConstraints,
  cplusplusDefaultModelNameConstraints,
  cplusplusDefaultPropertyKeyConstraints,
  CplusplusGenerator
} from '@/../../';
import type { DeepPartial } from '@/../../lib/types/utils';

import type { ModelinaCplusplusOptions, ModelProps } from '../../../types';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';

/**
 * This is the server side part of the C++ generator, that takes input and generator parameters and generate the models.
 */
export async function getCplusplusModels(
  input: any,
  generatorOptions: ModelinaCplusplusOptions
): Promise<ModelProps[]> {
  const options: DeepPartial<CplusplusOptions> = {
    namespace: generatorOptions.cplusplusNamespace || 'AsyncapiModels',
    presets: []
  };

  applyGeneralOptions(
    generatorOptions,
    options,
    cplusplusDefaultEnumKeyConstraints,
    cplusplusDefaultPropertyKeyConstraints,
    cplusplusDefaultModelNameConstraints
  );

  if (generatorOptions.showTypeMappingExample) {
    options.typeMapping = {
      Integer: ({ dependencyManager }) => {
        dependencyManager.addDependency('#include <MyIntegerType>');

        return 'MyIntegerType';
      }
    };
  }

  try {
    const generator = new CplusplusGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {
      namespace: 'asyncapi.models'
    });

    return convertModelsToProps(generatedModels);
  } catch (e) {
    console.error('Could not generate models');
    console.error(e);
  }

  return [];
}
