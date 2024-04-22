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

spawnSync(`cd ${__dirname}/../ && npm install ./scripts/modelina-package/asyncapi-modelina.tgz`)