import { JavaGenerator } from '../../../src/generators'; 

describe('JavaGenerator', function() {
  test('should `generate` function return OutputModels', async function() {
    const generator = JavaGenerator.createGenerator();

    const doc: any = { $id: 'test' };
    const models = await generator.generate(doc);

    expect(models[0].result).toEqual("JavaGenerator");
  });
});
