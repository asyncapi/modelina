
const {TypeScriptGenerator} = require('../../../lib');
const fs = require('fs');
const path = require('path');
/**
 * Render all schema models
 * @returns 
 */
async function renderModels() {
  const input = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../test.json')));
  const generator = new TypeScriptGenerator();
  const generatedModels = await generator.generate(input);
  const outputDir = path.resolve(__dirname, './output');
  await fs.promises.mkdir(outputDir, { recursive: true });
  const output = [];
  for (const generatedModel of generatedModels) {
    output.push(generatedModel.result);
  }
  const outputFile = path.resolve(outputDir, 'output.ts');
  await fs.promises.writeFile(outputFile, output.join('\n'));
}
renderModels();