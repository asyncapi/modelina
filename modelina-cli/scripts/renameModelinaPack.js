/**
 * This script is in charge of install the latest modelina package. 
 */
const path = require('path');
const modelinaPkg = require(path.resolve(__dirname, '../../package.json')); 
const fs = require('fs'); 
const { spawnSync } = require('child_process');
const { stderr, stdin } = require('process');

const modelinaPackageDir = path.resolve(__dirname, './modelina-package');
if (!fs.existsSync(modelinaPackageDir)){
    fs.mkdirSync(modelinaPackageDir);
}
const pathToTarball = path.resolve(__dirname, `./modelina-package/asyncapi-modelina.tgz`);
fs.renameSync(path.resolve(__dirname, `../asyncapi-modelina-${modelinaPkg.version}.tgz`), pathToTarball);

// Make sure we update the installed tarball as we will run into EINTEGRITY issues
console.log(`Installing new tarball @asyncapi/modelina dependency to avoid EINTEGRITY issues`)
const child = [
    spawnSync('npm', ['uninstall', '@asyncapi/modelina'], { encoding : 'utf8', cwd: path.resolve(__dirname, '../')}),
    spawnSync('npm', ['install', pathToTarball], { encoding : 'utf8', cwd: path.resolve(__dirname, '../')})
].reduce((previousSpawn, currentSpawn) => {return {stderr: previousSpawn.stderr + currentSpawn.stderr, stdout: previousSpawn.stdout + currentSpawn.stdout};});
// "install", path.resolve(__dirname, "./modelina-package/asyncapi-modelina.tgz")
console.log("stdout: ", child.stdout);
console.log("stderr: ", child.stderr);
console.log(`Modelina installed into CLI`);