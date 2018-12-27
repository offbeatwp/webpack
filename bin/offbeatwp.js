#!/usr/bin/env node
var exec =      require('child_process').exec;

const assetsDirectory = process.cwd() + "/assets";
const srcDirectory =    __dirname + '/../src';

const webpackConfig = __dirname + '/../config/webpack.config.js';

const task = process.argv.slice(2)[0];

const tasks = {
    dev() {
        this.exec(`webpack --mode development --watch --config ${webpackConfig} --color`);
    },
    production() {
        this.exec(`NODE_ENV='production' webpack --mode production --config ${webpackConfig} --color`);
    },
    icons() {
        this.exec(`node ${srcDirectory}/run icons --color`);
    },
    exec(cmd) {
        const execCommand = exec(cmd);

        execCommand.stdout.on('data', function (data) {
          console.log(data.toString().trim());
        });

        execCommand.stderr.on('data', function (data) {
          console.log(data.toString().trim());
        });
    }
}

if (typeof task !== 'undefined' && typeof tasks[task] === 'function') {
    tasks[task]();
    return;
}

// No valid task found
console.error('No valid task provided (dev|production|icons)' );