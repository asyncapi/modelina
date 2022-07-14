import { PropertyType } from '../../../models';
import { JavaPreset } from '../JavaPreset';

/**
 * Preset which adds `com.fasterxml.jackson` related annotations to class's property getters.
 * 
 * @implements {JavaPreset}
 */
export const JAVA_JACKSON_PRESET: JavaPreset = {
  class: {
    self({renderer, content}) {
      renderer.addDependency('import com.fasterxml.jackson.annotation.*;');
      return content;
    },
    getter({ renderer, propertyName, content, type }) {
      if (type === PropertyType.property) {
        const annotation = renderer.renderAnnotation('JsonProperty', `"${propertyName}"`);
        return renderer.renderBlock([annotation, content]);
      }
      return renderer.renderBlock([content]);
    },
  },
  enum: {
    self({renderer, content}) {
      renderer.addDependency('import com.fasterxml.jackson.annotation.*;');
      return content;
    },
    additionalContent({ renderer, model }) {
      const enumName = renderer.nameType(model.$id);
      const type = Array.isArray(model.type) ? 'Object' : model.type;
      const classType = renderer.toClassType(renderer.toJavaType(type, model));

      return `private ${classType} value;
    
${enumName}(${classType} value) {
  this.value = value;
}
    
@JsonValue
public ${classType} getValue() {
  return value;
}

@Override
public String toString() {
  return String.valueOf(value);
}

@JsonCreator
public static ${enumName} fromValue(${classType} value) {
  for (${enumName} e : ${enumName}.values()) {
    if (e.value.equals(value)) {
      return e;
    }
  }
  throw new IllegalArgumentException("Unexpected value '" + value + "'");
}`;
    },

  }
};
