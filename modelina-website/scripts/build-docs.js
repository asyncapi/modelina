const path = require('path');
const { readdir, readFile, writeFile, mkdir, stat } = require('fs/promises');
const { copyFileSync } = require('fs');
const DOCS_ROOT_PATH = path.join(__dirname, '../../docs');
const DOCS_CONFIG_PATH = path.join(__dirname, '../config/docs.json');
const MODELINA_ROOT_PATH = path.resolve(__dirname, '../../');

function prepareContent(content) { 
  content = content.replace('<!-- toc is generated with GitHub Actions do not remove toc markers -->', '');
  content = content.replace('<!-- toc -->', '');
  content = content.replace('<!-- tocstop -->', '');
  content = content.replaceAll('.md', '');

  // Use correct example links
  content = content.replace(/\]\((.*?)examples\/(.*?)\/?\)/g, '](/examples?selectedExample=$2)');

  // Use correct source code links
  content = content.replace(/\]\((.*?)src\/(.*?)\)/g, '](https://github.com/asyncapi/modelina/blob/master/src/$2)');

  // Replace all references to local images for docs
  content = content.replace(/"(.*?)\/img\/(.*?)"/g, '"/img/docs/img/$2"');

  return content;
}

/**
 * Build the docs tree structure
 */
async function buildDocsTree(rootPath) {
  if (!rootPath) return undefined;
  let slug = rootPath.replace(MODELINA_ROOT_PATH, '').toLowerCase().replace('/docs/', '');
  if(slug === '/docs') slug = '';
  // Check if rootPath is a file
  const fileStat = await stat(rootPath);
  if (!fileStat.isDirectory()) {
    //Ignore non-markdown and README files
    if(rootPath.endsWith('.md') && !rootPath.includes('README')) {
      let title = path.basename(rootPath, '.md');
      title = title.replaceAll('-', ' ');
      title = title.replaceAll('_', ' ');
      title = title.charAt(0).toUpperCase() + title.slice(1);
      let content = await readFile(rootPath, "utf8");
      content = prepareContent(content);
      return {type: 'file', fullPath: rootPath, slug: slug.split('.md')[0], title, content};
    }
    return undefined;
  }
  //Ignore certain directories
  if(rootPath.includes('img')) return undefined;

  let readmeContent = null;
  //Check if directory has main README file and use it's content 
  try{
    const dirRootReadmePath = path.resolve(rootPath, './README.md');
    let readmeFileStat = await stat(dirRootReadmePath);
    if(readmeFileStat.isFile()){
      readmeContent = await readFile(dirRootReadmePath, "utf8");
      readmeContent = prepareContent(readmeContent);
    }
  } catch(e) {}


  // If rootPath is a directory
  const dirPaths = await readdir(rootPath);

  // Recursively get all paths
  const subPaths = []
  for (const dirPath of dirPaths) {
    const filePath = path.join(rootPath, dirPath);
    const tree = await buildDocsTree(filePath);
    if(tree !== undefined) subPaths.push(tree);
  }
  const folderName = path.basename(rootPath);
  const pascalFolderName = folderName.replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
  return {type: 'dir', fullPath: rootPath, title: pascalFolderName, slug, subPaths, content: readmeContent};
}

function unwrapTree(tree) {
  let item = {};
  item[tree.slug] = tree;
  if(tree.type === 'dir') {
    for (const subDir of tree.subPaths) {
      item = {...item, ...unwrapTree(subDir)};
    }
  }
  return item;
}

/**
 * Build the docs config that include all documentations, folders and sub folders
 */
async function start() {
  const docPaths = await buildDocsTree(DOCS_ROOT_PATH);
  await writeFile(DOCS_CONFIG_PATH, JSON.stringify({tree: docPaths, unwrapped: unwrapTree(docPaths)}, null, 4));
}

start().catch(console.error);