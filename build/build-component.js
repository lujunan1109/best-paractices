/* 文件所在路径 build/build-component.js */
/* 编译组件 */
const fs = require('fs-extra');
const babel = require('@babel/core');
const path = require('path');

const esDir = path.join(__dirname, '../es');
const srcDir = path.join(__dirname, '../packages');
const babelConfig = {
    configFile: path.join(__dirname, '../babel.config.js')
};

const scriptRegExp = /\.(js|ts|tsx)$/;
const isScript = path => scriptRegExp.test(path);

/**
 * 是否是文件目录
 * @param {string} dir 
 */
const isDir = dir => fs.lstatSync(dir).isDirectory();

/**
 * 编译指定目录
 * @param {string} dir 
 */
function compile(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);

        // scan dir
        if (isDir(filePath)) {
            return compile(filePath);
        }

        // compile js or ts
        if (isScript(file)) {
            const { code } = babel.transformFileSync(filePath, babelConfig);
            fs.removeSync(filePath);
            fs.outputFileSync(filePath.replace(scriptRegExp, '.js'), code);
        }
    });
}

// 清除目录
fs.emptyDirSync(esDir);
// 编译目录
fs.copySync(srcDir, esDir)
compile(esDir);
