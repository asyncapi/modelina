/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RustOptions } from '@/../../';
import {
  rustDefaultEnumKeyConstraints,
  rustDefaultModelNameConstraints,
  rustDefaultPropertyKeyConstraints,
  RustGenerator
} from '@/../../';
import type { DeepPartial } from '@/../../lib/types/utils';

import type { ModelinaRustOptions, ModelProps } from '../../../types';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';

/**
 * This is the server side part of the Rust generator, that takes input and generator parameters and generate the models.
 */
export async function getRustModels(input: any, generatorOptions: ModelinaRustOptions): Promise<ModelProps[]> {
  const options: DeepPartial<RustOptions> = {
    presets: []
  };

  applyGeneralOptions(
    generatorOptions,
    options,
    rustDefaultEnumKeyConstraints,
    rustDefaultPropertyKeyConstraints,
    rustDefaultModelNameConstraints
  );

  if (generatorOptions.showTypeMappingExample) {
    options.typeMapping = {
      Integer: ({ dependencyManager }) => {
        dependencyManager.addDependency('mod my;');

        return 'my::IntegerType';
      }
    };
  }

  try {
    const generator = new RustGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {});

    return convertModelsToProps(generatedModels);
  } catch (e: any) {
    console.error('Could not generate models');
    console.error(e);

    return e.message;
  }
}
