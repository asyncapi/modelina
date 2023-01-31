import { OutputModel } from "../../../";
import { ModelsGeneratorProps } from "./Types";

/**
 * Converts the output model of Modelina to props
 */
export function convertModelToProps(generatedModels: OutputModel[]): ModelsGeneratorProps[] {
  return generatedModels.map((model) => {
    return {
      code: model.result,
      name: model.modelName
    };
  });
}