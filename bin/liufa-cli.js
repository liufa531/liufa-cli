#!/usr/bin/env node
const { Command } = require('commander');
const { create } = require('../lib/commands/create');
const packageJson = require('../package.json');
console.log(packageJson);
const program = new Command();

program
  .version(packageJson.version)
  .command('create <app-name>')
  .option('-t, --template <template>', 'Choose a template to use', 'default-template') // 默认模板为 default-template
  // .description('Create a new project')
  .action(async(appName) => {
    try {
      await create(appName);
    } catch (error) {
      console.error('Error creating project:', error.message);
    }
  });

program.parse(process.argv);
