/* eslint-disable @typescript-eslint/no-unused-vars */
import { ScalaGenerator, ScalaOptions, scalaDefaultEnumKeyConstraints, scalaDefaultModelNameConstraints, scalaDefaultPropertyKeyConstraints } from '../../../../../';
import { ModelinaScalaOptions, ModelProps } from '../../../types';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';
import { DeepPartial } from '../../../../../lib/types/utils';

// Function to generate Scala models based on input and options
export async function getScalaModels(
  input: any,
  generatorOptions: ModelinaScalaOptions
): Promise<ModelProps[]> {
  const options: DeepPartial<ScalaOptions> = {
    presets: []
  };
  
  applyGeneralOptions(generatorOptions, options, scalaDefaultEnumKeyConstraints, scalaDefaultPropertyKeyConstraints, scalaDefaultModelNameConstraints);

  if (generatorOptions.showTypeMappingExample) {
    options.typeMapping = {
      Integer: ({ dependencyManager }) => {
        dependencyManager.addDependency('');
        return 'MyIntegerType';
      }
    }
  }

  try {
    const generator = new ScalaGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {
      packageName: 'asyncapi.models'
    });
    return convertModelsToProps(generatedModels);
  } catch (e: any) {
    console.error('Could not generate Scala models');
    console.error(e);
    return e.message;
  }
}
