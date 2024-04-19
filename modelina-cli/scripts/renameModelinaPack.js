/**
 * This script is in charge of install the latest modelina package. 
 */
const path = require('path');
const modelinaPkg = require(path.resolve(__dirname, '../../package.json')); 
const fs = require('fs'); 

fs.renameSync(path.resolve(__dirname, `./modelina-package/asyncapi-modelina-${modelinaPkg.version}.tgz`), path.resolve(__dirname, `./modelina-package/asyncapi-modelina.tgz`));