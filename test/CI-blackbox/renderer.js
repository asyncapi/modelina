
const {JavaGenerator, JavaScriptGenerator, TypeScriptGenerator} = require('../../lib');
const fs = require('fs');
const path = require('path');
const languagesToInclude = process.argv.slice(2);
/**
 * Processes the input and renders the language the models
 */
async function processInput() {
  const input = JSON.parse(fs.readFileSync(path.resolve(__dirname, './test.json')));
  for (const language of languagesToInclude) {
    let generator;
    let outputPath;
    switch(language){
      case 'java':
        generator = new JavaGenerator();
        outputPath = './java/output.java';
      break;
      case 'js':
        generator = new JavaScriptGenerator();
        outputPath = './js/output.js';
      break;
      case 'ts':
        generator = new TypeScriptGenerator();
        outputPath = './ts/output.ts';
      break;
      default:
        throw new Error(`Does not understand language input ${language}`);
    }
    const generatedModels = await generator.generate(input);
    await renderModels(generatedModels, outputPath);
  }
}

/**
 * Render all models to file
 * 
 * @param {*} models 
 * @param {*} outputPath path to output
 */
async function renderModels(models, outputPath) {
  const outputDir = path.resolve(__dirname, path.dirname(outputPath));
  await fs.promises.mkdir(outputDir, { recursive: true });
  const output = [];
  for (const generatedModel of models) {
    output.push(generatedModel.result);
  }
  const outputFilePath = path.resolve(__dirname, outputPath);
  await fs.promises.writeFile(outputFilePath, output.join('\n'));
}

processInput().then(() => console.log('Done')).catch((e) => console.error(e));