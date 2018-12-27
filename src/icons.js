const webfontsGenerator = require('webfonts-generator');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

function getPaths(globs) {
    let out = [];

    globs.forEach(str => out = out.concat(glob.sync(str)));

    return out;
}

function ensureDirectoryExistence(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }

    const parentDirName = path.dirname(dirname);
    ensureDirectoryExistence(parentDirName);

    fs.mkdirSync(dirname);
    return true;
}

module.exports = function () {
    const baseDirectory = process.cwd();

    const outputDirectory = path.resolve(baseDirectory, 'resources/fonts/icons');
    ensureDirectoryExistence(outputDirectory);

    const files = getPaths([path.resolve(baseDirectory, 'resources/icons/*.svg')]);
    const fontName = 'icons';
    
    webfontsGenerator({
        files:          files,
        dest:           outputDirectory,
        cssDest:        path.join(outputDirectory, '_' + fontName + '.scss'),
        html:           false,
        cssTemplate:    path.resolve(__dirname, '../config/icons-css.hbs'),
        cssFontsUrl:   '../fonts/' + fontName + '/',
        fontName:       fontName,
        templateOptions: {
            classPrefix:    fontName + '-',
        }
    }, function(error) {
        if (error) {
            console.error('Fail!', error);
        } else {
            console.log('Done!');
        }
    });
    
};
