import { OutputModel } from '../../../../../';
import { ModelProps } from '../../../types';

/**
 * Converts the output model of Modelina to props
 */
export function convertModelsToProps(
  generatedModels: OutputModel[]
): ModelProps[] {
  return generatedModels.map((model) => {
    return {
      code: model.result,
      name: model.modelName
    };
  });
}
