import {DartPreset} from '../DartPreset';
import {FormatHelpers} from '../../../helpers/FormatHelpers';

/**
 * Preset which adds `json_serializable` related annotations to class's property getters.
 *
 * @implements {DartPreset}
 */
export const DART_JSON_PRESET: DartPreset = {
  class: {
    self({renderer, model, content}) {
      renderer.addDependency('import \'package:json_annotation/json_annotation.dart\';');
      const formattedModelName = renderer.nameType(model.$id);
      const snakeformattedModelName = FormatHelpers.snakeCase(formattedModelName);
      renderer.addDependency(`part '${snakeformattedModelName}.g.dart';`);
      renderer.addDependency('@JsonSerializable()');
      return content;
    },
    additionalContent({renderer, model}) {
      const formattedModelName = renderer.nameType(model.$id);
      return `factory ${formattedModelName}.fromJson(Map<String, dynamic> json) => _$${formattedModelName}FromJson(json);
Map<String, dynamic> toJson() => _$${formattedModelName}ToJson(this);`;
    }
  }, enum: {
    self({renderer, model, content}) {
      renderer.addDependency('import \'package:json_annotation/json_annotation.dart\';');
      const formattedModelName = renderer.nameType(model.$id);
      const snakeformattedModelName = FormatHelpers.snakeCase(formattedModelName);
      renderer.addDependency(`part '${snakeformattedModelName}.g.dart';`);
      renderer.addDependency('@JsonEnum(alwaysCreate:true)');
      return content;
    },
  }
};
