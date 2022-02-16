import { TypeScriptGenerator, ObjectModel, StringModel } from '../../src';

const generator = new TypeScriptGenerator();
const customModel = new ObjectModel();
const propertyModel = new StringModel();
customModel.addProperty('test property name', propertyModel);

export async function generate() : Promise<void> {
  const models = await generator.generate(rootModel);
  for (const model of models) {
    console.log(model.result);
  }
}
generate();
