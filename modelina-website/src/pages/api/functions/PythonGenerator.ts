import type { PythonOptions } from '@/../../';
import {
  pythonDefaultEnumKeyConstraints,
  pythonDefaultModelNameConstraints,
  pythonDefaultPropertyKeyConstraints,
  PythonGenerator
} from '@/../../';

import type { ModelinaPythonOptions, ModelProps } from '../../../types';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';

/**
 * This is the server side part of the Python generator, that takes input and generator parameters and generate the models.
 */
export async function getPythonModels(input: any, generatorOptions: ModelinaPythonOptions): Promise<ModelProps[]> {
  const options: Partial<PythonOptions> = {
    presets: []
  };

  applyGeneralOptions(
    generatorOptions,
    options,
    pythonDefaultEnumKeyConstraints,
    pythonDefaultPropertyKeyConstraints,
    pythonDefaultModelNameConstraints
  );

  try {
    const generator = new PythonGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {});

    return convertModelsToProps(generatedModels);
  } catch (e: any) {
    console.error('Could not generate models');
    console.error(e);

    return e.message;
  }
}
