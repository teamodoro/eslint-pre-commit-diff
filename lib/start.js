const path = require('path');
const child = require('child_process');
const minimist = require('minimist');
const argv = minimist(process.argv);

module.exports = function() {
    let commands = {
        eslint: path.join('node_modules', '.bin', 'eslint'),
        results: path.join('node_modules', 'eslint-pre-commit-diff', 'lib', 'results.js')
    };

    let folder = argv.folder || '';
    let fileType = argv['file-type'] || '.js';
    let result = [];
    let files = child.execSync('git diff HEAD --name-only');
    files = files.toString('utf8').split('\n');
    files.forEach(file => {
        if (-1 < file.indexOf(folder) && -1 < file.substr((-1 * fileType.length)).indexOf(fileType)) {
            result.push(file);
        }
    });

    result = result.join(' ');

    if (0 === result.length) {
        console.log('Нужных файлов для проверки нету.');
        process.exit(0);
    }

    child.exec(`${commands.eslint} -f ${commands.results} ${result}`, (err, stdout, strerr) => {
        if (0 < stdout.length) {
            console.log(stdout);
            process.exit(1);
        } else {
            console.log('Ты молодец, возьми на полке пирожок!');
            process.exit(0);
        }
    });
};
