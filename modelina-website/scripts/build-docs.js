const path = require('path');
const { readdir, readFile, writeFile, mkdir, stat } = require('fs/promises');
const DOCS_ROOT_PATH = path.join(__dirname, '../../docs');
const DOCS_CONFIG_PATH = path.join(__dirname, '../config/docs.json');
const MODELINA_ROOT_PATH = path.resolve(__dirname, '../../');
/**
 * Build the docs tree structure
 */
async function buildDocsTree(rootPath) {
  if (!rootPath) return undefined;
  
  const slug = rootPath.replace(MODELINA_ROOT_PATH, '');
  // Check if rootPath is a file
  const fileStat = await stat(rootPath);
  if (!fileStat.isDirectory()) {
    if(rootPath.endsWith('.md')) {
      const title = path.basename(rootPath, '.md');
      const fileContent = await readFile(rootPath, "utf8");
      //const fileContent = '';
      return {type: 'file', fullPath: rootPath, slug: slug.split('.md')[0], title, content: fileContent};
    }
    return undefined;
  }

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
  return {type: 'dir', fullPath: rootPath, title: folderName, slug, subPaths};
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