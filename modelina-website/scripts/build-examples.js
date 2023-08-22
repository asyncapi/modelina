const path = require('path');
const {readdir, readFile, writeFile, mkdir, } = require('fs/promises');

const refactorExampleName = (name) => {
  const [first, ...rest] = name.split('-');
  return first.charAt(0).toUpperCase() + first.slice(1) + " " + rest.join(" ")

}

const getDirectories = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
const examplesDirPath = path.resolve(__dirname, '../../examples');

const nameMapping = [
  'typescript',
  'java',
  'javascript',
  'kotlin',
  'rust',
  'typescript',
  'python',
  'csharp',
  'dart',
  'go',
  'cplusplus',
  'php'
];

/**
 * Find the proper language type for the output code.
 * 
 * Default to typescript if nothing is indicated in the name of the example
 */
function getLanguage(exampleName) {
  for (const name of nameMapping) {
    if(exampleName.includes(name)) {
      return name;
    }
  }

  return 'typescript';
}

async function getCode(exampleDirPath) {
  let code = await readFile(path.resolve(exampleDirPath, 'index.ts'), "utf-8");
  //Make sure the examples dont use local references
  code = code.replace(/from '\.\.\/\.\.\/src[^']*/g, "from '@asyncapi/modelina");
  return code;
}
function getOutput(exampleDirPath){
  const consoleLogOutputPath = path.resolve(exampleDirPath, './__snapshots__/index.spec.ts.snap');
  let output = require(consoleLogOutputPath);
    output = Object.values(output).map((exportValue) => {
      const searchValue = 'Array [\n  \"\"';
      exportValue = exportValue.slice(searchValue.length, exportValue.length);
      exportValue = exportValue.slice(0, exportValue.length-5);
      exportValue = exportValue.replace(/\\/g, "");
      return exportValue;
    }).join('\n\n');
  return output;
}
async function getDescription(exampleDirPath){
  let description = await readFile(path.resolve(exampleDirPath, './README.md'), "utf-8");
  const runExampleStart = description.search('## How to run this example');
  description = description.slice(0, runExampleStart);
  // Replace all local references to examples with queries
  description = description.replace(/\(..\/(.*?)(\/)?\)/g, '(?selectedExample=$1)');
  return description;
}

/**
 * Build the examples config
 */
async function start() {
  const configDirPath = path.resolve(__dirname, '../config');
  try {
    await mkdir(configDirPath);
  } catch(e) {}

  let exampleDirs = await getDirectories(examplesDirPath);
  //Filter out any examples that either:
  // 1. are impossible to show (react and next examples)
  // 2. should not be shown 
  exampleDirs = exampleDirs.filter((dir) => dir !== 'TEMPLATE' && dir !== 'integrate-with-react' && dir !== 'integrate-with-next'));
  const templateConfig = {};

  for (const example of exampleDirs) {
    const exampleDirPath = path.resolve(examplesDirPath, example);
    const code = await getCode(exampleDirPath);
    const output = getOutput(exampleDirPath);
    const description = await getDescription(exampleDirPath);
    const language = getLanguage(example);
    templateConfig[example] = {
      description: description,
      displayName: refactorExampleName(example),
      code,
      output,
      language
    }
  }

  const outputFile = path.resolve(__dirname, '../config/examples.json');
  await writeFile(outputFile, JSON.stringify(templateConfig, null, 4));

  let mainReadme = await readFile(path.resolve(__dirname, '../../examples/README.md'), 'utf-8');
  
  // Replace all local references to examples with queries
  mainReadme = mainReadme.replace(/\(.\/(.*?)(\/)?\)/g, '(?selectedExample=$1)');
  mainReadme = mainReadme.replace('<!-- toc is generated with GitHub Actions do not remove toc markers -->', '');
  mainReadme = mainReadme.replace('<!-- toc -->', '');
  mainReadme = mainReadme.replace('<!-- tocstop -->', '');
  mainReadme = mainReadme.replace('../docs/contributing.md', 'https://github.com/asyncapi/modelina/tree/master/examples/../docs/contributing.md');
  mainReadme = mainReadme.replace('- [integrate with React](?selectedExample=integrate-with-react/)', '- [integrate with React](https://github.com/asyncapi/modelina/tree/master/examples/integrate-with-react)');
  mainReadme = mainReadme.replace('- [integrate with Next](?selectedExample=integrate-with-next/)', '- [integrate with Next](https://github.com/asyncapi/modelina/tree/master/examples/integrate-with-next)');
  mainReadme = mainReadme.replace('- [TEMPLATE](?selectedExample=TEMPLATE)', '- [TEMPLATE](https://github.com/asyncapi/modelina/tree/master/examples/TEMPLATE)');
  const readmePath = path.resolve(__dirname, '../config/examples_readme.json');
  await writeFile(readmePath, JSON.stringify(mainReadme))
}

start().catch(console.error);