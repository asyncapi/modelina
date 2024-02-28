const fs = require('fs');
const path = require('path');

module.exports = {
    'generate:before': generator => {
        const asyncapi = generator.originalAsyncAPI;
        let extension;
        try {
            JSON.parse(asyncapi);
            extension = 'json'
        } catch (error) {
            extension = 'yaml'
        }

        fs.writeFileSync(
            path.resolve(
                generator.targetDir, `asyncapi.${extension}`
            )
            , asyncapi, { encoding: 'utf-8' }
        );
    }
}