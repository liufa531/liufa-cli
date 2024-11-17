const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const path = require('path');
const fs = require('fs');
const { exec, execSync } = require('child_process');
const outputFolder = path.join(process.cwd(), './dist/lib').replace(/\\/g, '/');
const sourceFolder = path.join(process.cwd(), './lib').replace(/\\/g, '/');
const packageJson = require('./package.json');
const dependenciesList = Object.keys(packageJson.dependencies).reduce(
  (pre, current) => {
    return pre.concat([current]);
  },
  [],
);
const osModule = require('os');
const isWindowsOs = osModule.type() == 'Windows_NT';

function collectFiles(sourceFolderPath) {
  let fileList = [];
  const walkSync = (currentDirPath) => {
    var fs = require('fs'),
      path = require('path');
    fs.readdirSync(currentDirPath).forEach(function (name) {
      console.log('name-----', name);
      var filePath = path.join(currentDirPath, name);
      var stat = fs.statSync(filePath);
      if (stat.isFile()) {
        fileList.push(filePath);
      } else if (stat.isDirectory()) {
        walkSync(filePath);
      }
    });
  };
  walkSync(sourceFolderPath);
  return fileList;
}

function processFiles(fileList) {
  console.log('files-----', fileList);
  fileList.map(async (filePath) => {
    filePath = filePath.replace(/\\/g, '/');
    const lastFileSuffixIndex = filePath.lastIndexOf('.');
    const lastDirIndex = filePath.lastIndexOf('/');

    const fileExtension = filePath.substring(lastFileSuffixIndex, filePath.length);
    let fileName = filePath.substring(lastDirIndex + 1, lastFileSuffixIndex);

    // 不符合
    if (!(filePath && filePath.length > 0 && lastFileSuffixIndex > -1)) return;
    if (filePath.indexOf('/templates/') > -1) return;

    ensureDirectoryExists(filePath);

    // 复制文件
    if (fileName + fileExtension === 'command.js') {
      const outputPath = filePath.replace(sourceFolder, outputFolder);
      const outputDirPath = outputPath.replace(fileName + fileExtension, '');
      try {
        fs.realpathSync(outputDirPath);
      } catch (e) {
        const command = !isWindowsOs ? `mkdir -p ${outputDirPath}` : `mkdir "${outputDirPath}"`;
        execSync(`${command}`);
      }
      execSync(`cp -rf ${filePath} ${outputPath}`);
      return;
    }
    // 转换编码
    if (fileExtension === '.js') {
      handleJsFile(filePath, fileName);
      return;
    }
  });
}

/**
 * 确保文件夹路径一定存在
 * @param {*} filePath 文件信息
 */
function ensureDirectoryExists(dirPath) {
  try {
    return fs.realpathSync(dirPath);
  } catch (e) {
    const command = !isWindowsOs ? `mkdir -p ${dirPath}` : `mkdir "${dirPath}"`;
    execSync(`${command}`);
  }
}

async function handleJsFile(filePath, fileName) {
  const outputFilePath = filePath.replace(sourceFolder, outputFolder);
  const outputOptions = {
    file: outputFilePath,
    format: 'umd',
    name: fileName,
  };
  // create a bundle
  const bundle = await rollup.rollup({
    input: filePath,
    plugins: [
      resolve({
        browser: true,
        resolveOnly: dependenciesList,
      }),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  });

  // or write the bundle to disk
  bundle.write(outputOptions);
}

exec(`rm -rf ${outputFolder}`);

const fileNamesToCopy = [
  'package.json',
  'react-template',
  'templates',
  'bin'
]
function copyFilesToOutput() {
  // 复制文件
  fileNamesToCopy.forEach((itemName) => {
    execSync(`cp -rf ${(__dirname, `./${itemName}`)} 'dist'`);
  })
}
// initialization on first run
async function main() {
  const fileList = collectFiles(sourceFolder);
  await processFiles(fileList);
  await copyFilesToOutput();
}

main();
