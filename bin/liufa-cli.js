#!/usr/bin/env node
const { Command } = require('commander');
const { create } = require('../lib/commands/create');
const packageJson = require('../package.json');
const program = new Command();

program
  .version(packageJson.version)
  .command('create <app-name>')
  .option('-t, --template <template>', 'Choose a template to use', 'default-template') // 默认模板为 default-template
  .description('Create a new project')
  .action(async(appName, options) => {
    console.log('options:', options);
    try {
      await create(appName);
    } catch (error) {
      console.error('Error creating project:', error.message);
    }
  });

program.on('--help', () => {
  console.log('');
  console.log('Examples:');
  console.log('');
  console.log('$ liufa-cli create my-project');
});
program.parse(process.argv);
