const path = require('path');
const { readdir, readFile, writeFile, stat } = require('fs/promises');
const DOCS_ROOT_PATH = path.join(__dirname, '../../docs');
const DOCS_CONFIG_PATH = path.join(__dirname, '../config/docs.json');
const MODELINA_ROOT_PATH = path.resolve(__dirname, '../../');

/**
 * Replace all the markdown and github specific stuff with something that works from the browser
 */
function prepareContent(content) {
  content = content.replace('<!-- toc is generated with GitHub Actions do not remove toc markers -->', '');
  content = content.replace('<!-- toc -->', '');
  content = content.replace('<!-- tocstop -->', '');

  // Replace all relative links with .md (./readme.md or ./readme.md#anchor) to pure names (/docs/readme or /docs/readme#anchor)
  content = content.replace(/\]\(\.\/(.*?)\.md(#[^)]*)?\\)/g, '](/docs/$1$2)');

  // Handle relative links going to parent directories (../../src/...) - convert to GitHub URLs
  // This handles links like ../../src/generators/csharp/Constants.ts
  content = content.replace(/\]\(\.\.\/\.\.\/(.*?)\)/g, '](https://github.com/asyncapi/modelina/blob/master/$1)');

  // Handle relative links to parent docs folder (../file.md or ../file.md#anchor) - convert to website routes
  content = content.replace(/\]\(\.\.\/(.*?)\.md(#[^)]*)?\\)/g, '](/docs/$1$2)');

  // Handle other relative non-markdown links within docs (./something) - convert to GitHub URLs
  content = content.replace(/\]\(\.\/([^)]+[^).md])\)/g, '](https://github.com/asyncapi/modelina/blob/master/docs/$1)');

  // Replace all relative links with README (./README) to (./)
  content = content.replace(/\]\(\.\/(.*?)README\)/g, '](./$1)');

  // Use correct example links
  content = content.replace(/\]\((.*?)examples\/(.*?)\/?\)/g, '](/examples?selectedExample=$2)');
  content = content.replace('/examples?selectedExample=integrate-with-react', 'https://github.com/asyncapi/modelina/tree/master/examples/integrate-with-react');
  content = content.replace('/examples?selectedExample=integrate-with-next', 'https://github.com/asyncapi/modelina/tree/master/examples/integrate-with-next');
  content = content.replace('/examples?selectedExample=integrate-with-maven', 'https://github.com/asyncapi/modelina/tree/master/examples/integrate-with-maven');

  // Replace all references to local images for docs
  content = content.replace(/"(.*?)\/img\/(.*?)"/g, '"/img/docs/$2"');

  return content;
}

/**
 * Build the docs tree structure
 */
async function buildDocsTree(rootPath) {
  if (!rootPath) return undefined;
  let slug = rootPath.replace(MODELINA_ROOT_PATH, '').toLowerCase().replace('/docs/', '').replace(/\\/g, '/').replace('\\docs\\', '');
  if (slug === '/docs') slug = '';
  // Check if rootPath is a file
  const fileStat = await stat(rootPath);
  if (!fileStat.isDirectory()) {
    //Ignore non-markdown and README files
    if (rootPath.endsWith('.md') && !rootPath.includes('README')) {
      const relativeRootPath = rootPath.split(MODELINA_ROOT_PATH)[1].replace(/\\/g, '/');
      let title = path.basename(rootPath, '.md');
      title = title.replace(/_/g, ' ');
      title = title.replace(/-/g, ' ');
      title = title.charAt(0).toUpperCase() + title.slice(1);
      let content = await readFile(rootPath, "utf8");
      content = prepareContent(content);
      return { type: 'file', fullPath: rootPath, relativeRootPath: relativeRootPath, slug: slug.split('.md')[0], title, content };
    }
    return undefined;
  }
  //Ignore certain directories
  if (rootPath.includes('img')) return undefined;

  let readmeContent = null;
  //Check if directory has main README file and use it's content 
  try {
    const dirRootReadmePath = path.resolve(rootPath, './README.md');
    const isRootReadme = path.resolve(__dirname, '../../docs') === rootPath;
    let readmeFileStat = await stat(dirRootReadmePath);
    if (readmeFileStat.isFile()) {
      readmeContent = await readFile(dirRootReadmePath, "utf8");
      readmeContent = prepareContent(readmeContent);

      if (isRootReadme) {
        // Replace relative references (./some-ref.md) to absolute refs (/docs/some-ref)
        readmeContent = readmeContent.replace(/\]\(\.\/(.*?)\)/g, '](/docs/$1)');
      }
    }
  } catch (e) { }


  // If rootPath is a directory
  const dirPaths = await readdir(rootPath);

  // Recursively get all paths
  const subPaths = []
  for (const dirPath of dirPaths) {
    const filePath = path.join(rootPath, dirPath);
    const tree = await buildDocsTree(filePath);
    if (tree !== undefined) subPaths.push(tree);
  }
  const folderName = path.basename(rootPath);
  const relativeRootPath = (rootPath.split(MODELINA_ROOT_PATH)[1] + '/README.md').replace(/\\/g, '/');
  const pascalFolderName = folderName.replace(/(\w)(\w*)/g, function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); });
  return { type: 'dir', fullPath: rootPath, relativeRootPath: relativeRootPath, title: pascalFolderName, slug, subPaths, content: readmeContent };
}

function unwrapTree(tree) {
  let item = {};
  item[tree.slug] = tree;
  if (tree.type === 'dir') {
    for (const subDir of tree.subPaths) {
      item = { ...item, ...unwrapTree(subDir) };
    }
  }
  return item;
}

/**
 * Build the docs config that include all documentations, folders and sub folders
 */
async function start() {
  const docPaths = await buildDocsTree(DOCS_ROOT_PATH);
  await writeFile(DOCS_CONFIG_PATH, JSON.stringify({ tree: docPaths, unwrapped: unwrapTree(docPaths) }, null, 4));
}

start().catch(console.error);