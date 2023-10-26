/* eslint-disable @typescript-eslint/no-unused-vars */
import { JavaGenerator, JavaOptions, javaDefaultEnumKeyConstraints, javaDefaultModelNameConstraints, javaDefaultPropertyKeyConstraints, JAVA_JACKSON_PRESET, JAVA_COMMON_PRESET, JAVA_DESCRIPTION_PRESET, JAVA_CONSTRAINTS_PRESET } from '../../../../../';
import { applyGeneralOptions, convertModelsToProps } from './Helpers';
import { ModelinaJavaOptions, ModelProps } from '../../../types';
import { DeepPartial } from '../../../../../lib/types/utils';

/**
 * This is the server side part of the Java generator, that takes input and generator parameters and generate the models.
 */
export async function getJavaModels(
  input: any,
  generatorOptions: ModelinaJavaOptions
): Promise<ModelProps[]> {
  const options: DeepPartial<JavaOptions> = {
    presets: []
  };
  applyGeneralOptions(generatorOptions, options, javaDefaultEnumKeyConstraints, javaDefaultPropertyKeyConstraints, javaDefaultModelNameConstraints);

  if (generatorOptions.javaIncludeJackson) {
    options.presets?.push(JAVA_JACKSON_PRESET)
  }

  if (generatorOptions.javaIncludeMarshaling) {
    options.presets?.push({
      preset: JAVA_COMMON_PRESET,
      options: {
        equal: false,
        hashCode: false,
        classToString: false,
        marshalling: true
      }
    })
  }

  if (generatorOptions.javaArrayType) {
    options.collectionType = generatorOptions.javaArrayType;
  }

  if (generatorOptions.javaOverwriteHashcode) {
    options.presets?.push(
      {
        preset: JAVA_COMMON_PRESET,
        options: {
          equal: false,
          hashCode: true,
          classToString: false,
          marshalling: false
        }
      }
    )
  }

  if (generatorOptions.javaOverwriteEqual) {
    options.presets?.push({
      preset: JAVA_COMMON_PRESET,
      options: {
        equal: true,
        hashCode: false,
        classToString: false,
        marshalling: false
      }
    })
  }

  if(generatorOptions.javaOverwriteToString){
    options.presets?.push({
      preset: JAVA_COMMON_PRESET,
      options: {
        equal: false,
        hashCode: false,
        classToString: true,
        marshalling: false
      }
    })
  }

  if (generatorOptions.javaJavaDocs) {
    options.presets?.push(JAVA_DESCRIPTION_PRESET)
  }

  if (generatorOptions.javaJavaxAnnotation) {
    options.presets?.push(JAVA_CONSTRAINTS_PRESET)
  }

  if (generatorOptions.showTypeMappingExample) {
    options.typeMapping = {
      Integer: ({ dependencyManager }) => {
        dependencyManager.addDependency('import java.util.ArrayList;');
        return 'long';
      }
    }
  }

  try {
    const generator = new JavaGenerator(options);
    const generatedModels = await generator.generateCompleteModels(input, {
      packageName: generatorOptions.javaPackageName ?? 'asyncapi.models'
    });
    return convertModelsToProps(generatedModels);
  } catch (e : any) {
    console.error('Could not generate models');
    console.error(e);
    return e.message;
  }
}
