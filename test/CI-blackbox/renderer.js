
const {JavaGenerator, JavaScriptGenerator, TypeScriptGenerator} = require('../../lib');
const fs = require('fs').promises;
const path = require('path');
/**
 * Processes the input and renders the language the models
 */
async function processInput() {
  const languagesToInclude = process.argv.slice(2);
  const inputFileContent = await fs.readFile(path.resolve(__dirname, './test.json'));
  const input = JSON.parse(inputFileContent);
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
  await fs.mkdir(outputDir, { recursive: true });
  const output = models.map((model) => {
    return model.result;
  });
  const outputFilePath = path.resolve(__dirname, outputPath);
  await fs.writeFile(outputFilePath, output.join('\n'));
}

processInput().then(() => console.log('Done')).catch((e) => console.error(e));