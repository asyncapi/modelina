/* eslint-disable @typescript-eslint/no-unused-vars */
import { PythonGenerator, PythonOptions, pythonDefaultEnumKeyConstraints, pythonDefaultModelNameConstraints, pythonDefaultPropertyKeyConstraints } from '../../../../../';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';
import { ModelinaPythonOptions, ModelProps } from '../../../types';

/**
 * This is the server side part of the Python generator, that takes input and generator parameters and generate the models.
 */
export async function getPythonModels(
  input: any,
  generatorOptions: ModelinaPythonOptions
): Promise<ModelProps[]> {
  const options: Partial<PythonOptions> = {
    presets: []
  };
  applyGeneralOptions(generatorOptions, options, pythonDefaultEnumKeyConstraints, pythonDefaultPropertyKeyConstraints, pythonDefaultModelNameConstraints);

  try {
    const generator = new PythonGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input);
    return convertModelsToProps(generatedModels);
  } catch (e : any) {
    console.error('Could not generate models');
    console.error(e);
    return e.message;
  }
}
