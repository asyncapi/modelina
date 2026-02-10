/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DartOptions } from '@/../../';
import {
  dartDefaultEnumKeyConstraints,
  dartDefaultModelNameConstraints,
  dartDefaultPropertyKeyConstraints,
  DartGenerator
} from '@/../../';
import type { DeepPartial } from '@/../../lib/types/utils';

import type { ModelinaDartOptions, ModelProps } from '@/types';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';

/**
 * This is the server side part of the Dart generator, that takes input and generator parameters and generate the models.
 */
export async function getDartModels(input: any, generatorOptions: ModelinaDartOptions): Promise<ModelProps[]> {
  const options: DeepPartial<DartOptions> = {
    presets: []
  };

  applyGeneralOptions(
    generatorOptions,
    options,
    dartDefaultEnumKeyConstraints,
    dartDefaultPropertyKeyConstraints,
    dartDefaultModelNameConstraints
  );

  if (generatorOptions.showTypeMappingExample) {
    options.typeMapping = {
      Integer: ({ dependencyManager }) => {
        dependencyManager.addDependency("import 'package:lib/lib.dart' as lib;");

        return 'lib.MyIntegerType';
      }
    };
  }

  try {
    const generator = new DartGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {});

    return convertModelsToProps(generatedModels);
  } catch (e: any) {
    console.error('Could not generate models');
    console.error(e);

    return e.message;
  }
}
