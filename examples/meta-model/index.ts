import {
  TypeScriptGenerator,
  ObjectModel,
  StringModel,
  ObjectPropertyModel,
  InputMetaModel
} from '../../src';

const generator = new TypeScriptGenerator();
const customModel = new ObjectModel('SomeName', undefined, {}, {});
const stringModel = new StringModel('test property name', undefined, {});
const propertyModel = new ObjectPropertyModel(
  stringModel.name,
  false,
  stringModel
);
customModel.properties[propertyModel.propertyName] = propertyModel;

const inputModel = new InputMetaModel();
inputModel.models[customModel.name] = customModel;

export async function generate(): Promise<void> {
  const models = await generator.generate(inputModel);
  for (const model of models) {
    console.log(model.result);
  }
}
if (require.main === module) {
  generate();
}
