import { CSharpPreset } from '../CSharpPreset';
import { CSharpOptions } from '../CSharpGenerator';

/**
 * Preset which adds custom enum value mapping for Newtonsoft.JSON serializer
 * 
 * @implements {CSharpPreset}
 */
export const CSHARP_NEWTONSOFT_SERIALIZER_PRESET: CSharpPreset<CSharpOptions> = {
  enum: {
    self: async ({ renderer, model }) => {
      renderer.addDependency('using Newtonsoft.Json;');
      renderer.addDependency('using Newtonsoft.Json.Converters;');
      renderer.addDependency('using System.Runtime.Serialization;');

      const enumItems = await renderer.renderItems();

      return `${renderer.indent('[JsonConverter(typeof(StringEnumConverter))]')}
${renderer.indent(`public enum ${model.name}`)}
${renderer.indent('{')}
${renderer.indent(enumItems)}
${renderer.indent('}')}`;
    },
    item: ({content, item, renderer}): string => {
      return `${renderer.indent(`[EnumMember(Value="${item.value.toString().replaceAll(/(^")|("$)/g, '')}")]`)}
${renderer.indent(content)}`;
    }
  },
};
