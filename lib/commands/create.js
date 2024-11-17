const fse = require('fs-extra');
const path = require('path');
const { exec } = require('child_process'); // 引入 child_process 模块


async function create(appName) {
  const projectDir = path.join(process.cwd(), appName);
  const templateDir = path.join(__dirname, '../../templates'); // 假设模板在 templates 目录下

  // 创建项目目录
  await fse.ensureDir(projectDir);

  // 复制模板文件
  await fse.copy(templateDir, projectDir);

  // 初始化项目
  await initializeProject(projectDir);

  console.log(`Project ${appName} created successfully!`);
}

function initializeProject(projectDir) {
  process.chdir(projectDir);

  // 安装依赖
  return new Promise((resolve, reject) => {
    exec('npm install', (err, stdout, stderr) => {
      if (err) {
        console.error('Error installing dependencies:', err);
        reject(err);
      } else {
        console.log('Dependencies installed successfully!');
        resolve();
      }
    });
  }).then(() => {
    // 生成配置文件
    // return fse.outputFile('config.json', JSON.stringify({ key: 'value' }, null, 2));
  });
}

module.exports = { create };
