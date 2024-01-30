import { ModelProps, ModelinaScalaOptions } from "@/types";
import { DeepPartial } from "../../../../../lib/types/utils";
import { scalaDefaultEnumKeyConstraints, scalaDefaultModelNameConstraints, scalaDefaultPropertyKeyConstraints, ScalaGenerator, ScalaOptions } from "../../../../../";
import { applyGeneralOptions, convertModelsToProps } from "./Helpers";

/**
 * This is the server side part of the Scala generator, that takes input and generator parameters to generate the models.
 */

export async function getScalaModels(
    input:any,
    generatorOptions: ModelinaScalaOptions
): Promise<ModelProps[]> {
    const options: DeepPartial<ScalaOptions> = {
        presets: []
    };
    applyGeneralOptions(generatorOptions, options, scalaDefaultEnumKeyConstraints, scalaDefaultPropertyKeyConstraints, scalaDefaultModelNameConstraints);

    if(generatorOptions.showTypeMappingExample) {
        options.typeMapping = {
            Integer: ({ dependencyManager }) => {
                dependencyManager.addDependency('mod my;');
                return 'my::IntegerType';
            }
        }
    }

    try {
        const generator = new ScalaGenerator(options);
        const generatedModels = await generator.generateCompleteModels(input, {});
        return convertModelsToProps(generatedModels);
    } catch (e : any) {
        console.error('Could not generate models');
        console.error(e);
        return e.message;
    }
}