import { JavaPreset } from '../JavaPreset';

/**
 * Preset which adds `com.fasterxml.jackson` related annotations to class's getters.
 * 
 * @implements {JavaPreset}
 */
export const JAVA_JACKSON_PRESET: JavaPreset = {
  class: {
    self({renderer, content}) {
      renderer.addDependency('import com.fasterxml.jackson.annotation.*;');
      return content;
    },
    getter({ renderer, propertyName, content }) {
      const annotation = renderer.renderAnnotation('JsonProperty', `"${propertyName}"`);
      return renderer.renderBlock([annotation, content]);
    },
  }
};
