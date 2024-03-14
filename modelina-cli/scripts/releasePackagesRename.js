 

const { rename, access, mkdir } = require('node:fs').promises;
const packageJson = require('../package.json');
const path = require('node:path');
const simpleGit = require('simple-git');
const git = simpleGit({baseDir: process.cwd()});

async function fileExists(checkPath) {
  try {
    await access(checkPath);
    return true;
  } catch {
    return false;
  }
}

async function checkAndRenameFile(generatedPath, newPath) {
  if (await fileExists(generatedPath)) {
    await rename(generatedPath, newPath);
  }
}

async function createDirectory(directoryPath) {
  if (await fileExists(directoryPath)) {
    await mkdir(directoryPath);
  }
}

async function renameDeb({version, name, sha}) {
  const dist = 'dist/deb';

  // deb package naming convention: https://github.com/oclif/oclif/blob/fb5da961f925fa0eba5c5b05c8cee0c9bd156c00/src/upload-util.ts#L51
  const generatedPath = path.resolve(dist, `${name}_${version}.${sha}-1_amd64.deb`);
  const newPath = path.resolve(dist, 'modelina.deb');
  await checkAndRenameFile(generatedPath, newPath);
}

async function renameTar({version, name, sha}) {
  const dist = 'dist';

  const generatedPath = path.resolve(dist, `${name}-v${version}-${sha}-linux-x64.tar.gz`);
  // for tarballs, the files are generated in `dist/` directory.
  // Creates a new `tar` directory(`dist/tar`), and moves the generated tarball inside that directory.
  const tarDirectory = path.resolve(dist, 'tar');
  await createDirectory(tarDirectory);
  const newPath = path.resolve(tarDirectory, 'modelina.tar.gz');
  await checkAndRenameFile(generatedPath, newPath);
}

async function renameWindows({version, name, sha, arch}) {
  const dist = 'dist/win32';

  const generatedPath = path.resolve(dist, `${name}-v${version}-${sha}-${arch}.exe`);
  const newPath = path.resolve(dist, `modelina.${arch}.exe`);
  await checkAndRenameFile(generatedPath, newPath);
}

async function renamePkg({version, name, sha, arch}) {
  const dist = 'dist/macos';

  const generatedPath = path.resolve(dist, `${name}-v${version}-${sha}-${arch}.pkg`);
  const newPath = path.resolve(dist, `modelina.${arch}.pkg`);
  await checkAndRenameFile(generatedPath, newPath);
}

async function renamePackages() {
  const version = packageJson.version;
  const name = 'modelina';
  const sha = await git.revparse(['--short', 'HEAD']);
  await renameDeb({version: version.split('-')[0], name, sha});
  await renamePkg({version, name, sha, arch: 'x64'});
  await renamePkg({version, name, sha, arch: 'arm64'});
  await renameWindows({version, name, sha, arch: 'x64'});
  await renameWindows({version, name, sha, arch: 'x86'});
  await renameTar({version, name, sha});
}

renamePackages();
