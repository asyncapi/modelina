import { TypeScriptPreset } from '../TypeScriptPreset';
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const alterschema = require('alterschema');

function getInputSchema(originalInput: any): string {
  if (originalInput.$schema !== undefined) {
    if (
      originalInput.$schema.includes('http://json-schema.org/draft-04/schema')
    ) {
      return 'draft4';
    }
    if (
      originalInput.$schema.includes('http://json-schema.org/draft-06/schema')
    ) {
      return 'draft6';
    }
  }
  return 'draft7';
}

/**
 * Preset which adds jsonbinpack marshalling/unmarshalling methods
 *
 * @implements {TypeScriptPreset}
 */
export const TS_JSONBINPACK_PRESET: TypeScriptPreset = {
  class: {
    async additionalContent({ renderer, content, model }) {
      renderer.dependencyManager.addDependency('const jsonbinpack = require(\'jsonbinpack\')')

      let jsonSchema = await alterschema(
        model.originalInput,
        getInputSchema(model.originalInput),
        '2020-12'
      );
      jsonSchema['$schema'] = "https://json-schema.org/draft/2020-12/schema";
      const json = JSON.stringify(jsonSchema);
      const packContent = `public async jsonbinSerialize(): Promise<Buffer>{
  const jsonData = JSON.parse(this.marshal());
  const jsonbinpackEncodedSchema = await jsonbinpack.compileSchema(${json});
  return jsonbinpack.serialize(jsonbinpackEncodedSchema, jsonData);
}

public static async jsonbinDeserialize(buffer: Buffer): Promise<${model.name}> {
  const jsonbinpackEncodedSchema = await jsonbinpack.compileSchema(${json});
  const json = jsonbinpack.deserialize(jsonbinpackEncodedSchema, buffer);
  return ${model.name}.unmarshal(json);
}`;
      return `${content}\n${packContent}`;
    }
  }
};
