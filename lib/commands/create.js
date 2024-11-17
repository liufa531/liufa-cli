const fse = require('fs-extra');
const path = require('path');
const { exec } = require('child_process'); // 引入 child_process 模块
const inquirer = require('inquirer'); // 引入 inquirer 模块

async function create(appName) {
  const projectDir = path.join(process.cwd(), appName);

  const templatesDir = path.join(__dirname, '../../templates');
  const reactTemplatesDir = path.join(__dirname, '../../react-template');

  // 检查目录是否存在
  if (!fse.existsSync(templatesDir)) {
    throw new Error(`Directory ${templatesDir} does not exist`);
  }

  if (!fse.existsSync(reactTemplatesDir)) {
    throw new Error(`Directory ${reactTemplatesDir} does not exist`);
  }

  // 读取并构建 templateFiles 数组
  const templateFiles = [
    {
      name: `default-templates`,
      value: templatesDir,
    },
    {
      name: `react-template`,
      value: reactTemplatesDir,
    }
  ];

  // console.log('templateFiles:', templateFiles);
  // 提示用户选择模板文件
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: '请选择一个模板文件:',
      choices: templateFiles,
    },
  ]);

  const selectedTemplatePath = answers.template;
  console.log('selectedTemplatePath:', selectedTemplatePath);

  // 创建项目目录
  await fse.ensureDir(projectDir);
  console.log('🚀正在创建模版...');
  // 复制选中的模板文件
  await fse.copy(
    selectedTemplatePath,
    projectDir
  );

  console.log('模版创建完成 ✅');

  // 初始化项目
  await initializeProject(projectDir);

  console.log(
    `Project ${appName} created successfully with template: ${path.basename(
      selectedTemplatePath,
    )}!`,
  );
}

// 初始化项目
function initializeProject(projectDir) {
  process.chdir(projectDir);
  console.log('🐢正在安装依赖...');
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
