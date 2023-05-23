import { PythonPreset } from '../PythonPreset';

/**
 * Preset which adds JSON serialization and deserialization to the generated
 * Python classes.
 *
 * @implements {PythonPreset}
 */
export const PYTHON_JSON_SERIALIZER_PRESET: PythonPreset = {
  class: {
    additionalContent({ renderer, model, content }) {
      renderer.dependencyManager.addDependency('import json');

      const serializeContent = `def serializeToJson(self):
  return json.dumps(self.__dict__, default=lambda o: o.__dict__, indent=2)`.trim();

      const deserializeContent = `@staticmethod
def deserializeFromJson(json_string):
  return ${model.name}(**json.loads(json_string))`.trim();

      return renderer.renderBlock(
        [content, serializeContent, deserializeContent],
        2
      );
    }
  }
};
