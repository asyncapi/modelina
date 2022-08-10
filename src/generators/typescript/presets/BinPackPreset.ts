import { TypeScriptPreset } from '../TypeScriptPreset';
const alterschema = require('alterschema');

/**
 * Preset which adds descriptions
 *
 * @implements {TypeScriptPreset}
 */
export const TS_BINPACK_PRESET: TypeScriptPreset = {
  class: {
    async additionalContent({renderer, content, model}) {
      renderer.addDependency('const jsonbinpack = require(\'jsonbinpack\');');
      const jsonSchema = await alterschema(model.originalInput, 'draft7', '2020-12');
      const json = JSON.stringify(jsonSchema);
      const packContent = `
public async jsonbinSerialize(): Promise<Buffer>{
  const jsonData = JSON.parse(this.marshal());
  const jsonbinpackEncodedSchema = await jsonbinpack.compileSchema(${json});
  return jsonbinpack.serialize(jsonbinpackEncodedSchema, jsonData);
}

public static async jsonbinDeserialize(buffer: Buffer): Promise<${model.name}> {
  const jsonbinpackEncodedSchema = await jsonbinpack.compileSchema(${json});
  const json = jsonbinpack.deserialize(jsonbinpackEncodedSchema, buffer);
  return ${model.name}.unmarshal(json);
}`;
      return `${content}\n${packContent}`
    }
  }
};

/**
 * Potential runtime test:
 * 
const instance = new Test({});
instance.email = 'testing@test.com';
const expectedJSON = JSON.parse(instance.marshal());
const jsonpackbuffer = await instance.jsonbinSerialize();
const test = await Test.jsonbinDeserialize(jsonpackbuffer);
const actualJson = JSON.parse(test.marshal());
expect(actualJson).toEqual(expectedJSON);
 * 
 */