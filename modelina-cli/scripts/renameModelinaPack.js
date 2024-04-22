/**
 * This script is in charge of install the latest modelina package. 
 */
const path = require('path');
const modelinaPkg = require(path.resolve(__dirname, '../../package.json')); 
const fs = require('fs'); 
const { spawnSync } = require('child_process');

const modelinaPackageDir = path.resolve(__dirname, './modelina-package');
if (!fs.existsSync(modelinaPackageDir)){
    fs.mkdirSync(modelinaPackageDir);
}
fs.renameSync(path.resolve(__dirname, `../asyncapi-modelina-${modelinaPkg.version}.tgz`), path.resolve(__dirname, `./modelina-package/asyncapi-modelina.tgz`));

// Make sure we update the installed tarball as we will run into EINTEGRITY issues
console.log(`Installing new tarball @asyncapi/modelina dependency to avoid EINTEGRITY issues`)
var child = spawnSync(`npm`, ["upgrade", "@asyncapi/modelina"], { encoding : 'utf8', cwd: path.resolve(__dirname, '../')});
console.log("stdout: ",child.stdout);
console.log("stderr: ",child.stderr);
console.log("exist code: ",child.status);
console.log(`Modelina installed into CLI`);