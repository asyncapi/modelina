
const {JavaGenerator, JavaScriptGenerator, TypeScriptGenerator, FormatHelpers} = require('../../lib');
const fs = require('fs').promises;
const path = require('path');

/**
 * Processes the input and renders the language the models
 */
async function processInput() {
  const languagesToInclude = process.argv.slice(2);
  if(languagesToInclude.length === 0) {
    console.error(`No languages provided, please provide one or more of the following languages: js, ts, java.`);
    process.exit(0);
  }
  const inputFileContent = await fs.readFile(path.resolve(__dirname, './dummy.json'));
  const input = JSON.parse(inputFileContent);
  for (const language of languagesToInclude) {
    if (language === 'java') {
      //Because of the nature of Java we have to write each model to separate files
      const generator = new JavaGenerator();
      const outputPath = './java';
      const generatedModels = await generator.generate(input);
      await renderModelsToSeparateFiles(generatedModels, outputPath);
    } else {
      let generator;
      let outputPath;
      switch(language){
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
}

/**
 * Render all models to separate files in the same directory
 * 
 * @param {*} generatedModels to write to file
 * @param {*} outputPath path to output
 */
async function renderModelsToSeparateFiles(generatedModels, outputPath) {
  const outputDir = path.resolve(__dirname, outputPath);
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
  for(const outputModel of generatedModels) {
    const outputFilePath = path.resolve(__dirname, outputPath, `${FormatHelpers.toPascalCase(outputModel.model.$id)}.java`);
    await fs.writeFile(outputFilePath, outputModel.result);
  }
}

/**
 * Render all models to a single file
 * 
 * @param {*} models to write to file
 * @param {*} outputPath path to output
 */
async function renderModels(generatedModels, outputPath) {
  const outputDir = path.resolve(__dirname, path.dirname(outputPath));
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });
  const output = generatedModels.map((model) => {
    return model.result;
  });
  const outputFilePath = path.resolve(__dirname, outputPath);
  await fs.writeFile(outputFilePath, output.join('\n'));
}

processInput().then(() => console.log('Done')).catch((e) => console.error(e));