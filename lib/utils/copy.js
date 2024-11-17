  // /复制选中的模板文件夹中的文件
  async function copyTemplateFiles(selectedTemplatePath, projectDir) {
    try {
      // 读取模板文件夹中的所有文件
      const files = await fse.readdir(selectedTemplatePath);

      // 遍历每个文件并复制到目标项目目录
      for (const file of files) {
        const sourceFilePath = path.join(selectedTemplatePath, file);
        const targetFilePath = path.join(projectDir, file);

        // 检查文件是否为目录
        const stats = await fse.stat(sourceFilePath);
        if (stats.isDirectory()) {
          // 如果是目录，递归复制
          await fse.copy(sourceFilePath, targetFilePath);
        } else {
          // 如果是文件，直接复制
          await fse.copyFile(sourceFilePath, targetFilePath);
        }
      }

      console.log('模板文件已成功复制到项目目录');
    } catch (error) {
      console.error('复制模板文件时发生错误:', error);
    }
  }

  module.exports = copyTemplateFiles;
