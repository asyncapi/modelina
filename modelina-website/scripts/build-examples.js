const path = require('path');
const {readdir, readFile, writeFile} = require('fs/promises');

const getDirectories = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

/**
 * Find the proper language type for the output code.
 * 
 * Default to typescript if nothing is indicated in the name of the example
 */
function getLanguage(exampleName) {
  if(exampleName.includes('typescript')) {
    return 'typescript';
  }

  if(exampleName.includes('java')) {
    return 'java';
  }

  if(exampleName.includes('javascript')) {
    return 'javascript';
  }

  if(exampleName.includes('kotlin')) {
    return 'kotlin';
  }

  if(exampleName.includes('rust')) {
    return 'rust';
  }

  if(exampleName.includes('typescript')) {
    return 'typescript';
  }

  if(exampleName.includes('python')) {
    return 'python';
  }

  if(exampleName.includes('csharp')) {
    return 'csharp';
  }

  if(exampleName.includes('dart')) {
    return 'dart';
  }

  if(exampleName.includes('go')) {
    return 'go';
  }

  return 'typescript';
}

async function start() {
  const examplesDirPath = path.resolve(__dirname, '../../examples');
  let exampleDirs = await getDirectories(examplesDirPath);
  exampleDirs = exampleDirs.filter((dir) => dir !== 'TEMPLATE' && dir !== 'integrate-with-react');
  const templateConfig = {};
  console.log(exampleDirs);
  for (const example of exampleDirs) {
    const exampleDirPath = path.resolve(examplesDirPath, example);
    let templateCode = await readFile(path.resolve(exampleDirPath, 'index.ts'), "utf-8");
    templateCode = templateCode.replaceAll(/from '\.\.\/\.\.\/src[^']*/g, "from '@asyncapi/modelina");

    const consoleLogOutputPath = path.resolve(exampleDirPath, './__snapshots__/index.spec.ts.snap');
    let output = require(consoleLogOutputPath);
    output = Object.values(output).map((exportValue) => {
      const searchValue = 'Array [\n  \"\"';
      exportValue = exportValue.slice(searchValue.length, exportValue.length);
      exportValue = exportValue.slice(0, exportValue.length-5);
      exportValue = exportValue.replaceAll("\\", "");
      return exportValue;
    }).join('\n\n');
    let description = await readFile(path.resolve(exampleDirPath, './README.md'), "utf-8");
    const runExampleStart = description.search('## How to run this example');
    description = description.slice(0, runExampleStart);
    templateConfig[example] = {
      description: description,
      displayName: example,
      code: templateCode,
      output,
      language: getLanguage(example)
    }
  }
  console.log(templateConfig);
  const outputFile = path.resolve(__dirname, '../config/examples.json')
  await writeFile(outputFile, JSON.stringify(templateConfig, null, 4));
}

start();