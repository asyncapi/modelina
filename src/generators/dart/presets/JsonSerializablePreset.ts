import { FormatHelpers } from '../../../helpers';
import { DartPreset } from '../DartPreset';

/**
 * Preset which adds `json_serializable` related annotations to class's property getters.
 *
 * @implements {DartPreset}
 */
export const DART_JSON_PRESET: DartPreset = {
  class: {
    self({ renderer, model, content }) {
      const snakeformattedModelName = FormatHelpers.snakeCase(model.name);
      renderer.dependencyManager.addDependency(
        `import 'package:json_annotation/json_annotation.dart';`
      );
      renderer.dependencyManager.addDependency(
        `part '${snakeformattedModelName}.g.dart';`
      );
      renderer.dependencyManager.addDependency('@JsonSerializable()');
      return content;
    },
    additionalContent({ model }) {
      return `factory ${model.name}.fromJson(Map<String, dynamic> json) => _$${model.name}FromJson(json);
Map<String, dynamic> toJson() => _$${model.name}ToJson(this);`;
    }
  },
  enum: {
    self({ renderer, model, content }) {
      const snakeformattedModelName = FormatHelpers.snakeCase(model.name);
      renderer.dependencyManager.addDependency(
        `import 'package:json_annotation/json_annotation.dart';`
      );
      renderer.dependencyManager.addDependency(
        `part '${snakeformattedModelName}.g.dart';`
      );
      renderer.dependencyManager.addDependency('@JsonEnum(alwaysCreate:true)');
      return content;
    }
  }
};
