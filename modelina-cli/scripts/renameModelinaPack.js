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
spawnSync(`cd ${__dirname}/../ && npm update @asyncapi/modelina`)