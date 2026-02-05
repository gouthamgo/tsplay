#!/usr/bin/env node
import { program } from 'commander';
import { runPlayground } from './runner.js';
import { createExampleFile } from './templates.js';
import chalk from 'chalk';
import { existsSync } from 'fs';
import * as readline from 'readline';

async function promptForFilename(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(chalk.cyan('📝 Enter filename (e.g., learn.ts): '), (answer) => {
      rl.close();
      const filename = answer.trim() || 'playground.ts';
      resolve(filename.endsWith('.ts') ? filename : `${filename}.ts`);
    });
  });
}

program.name('tsplay').description('🎮 TypeScript Playground').version('1.0.0');
program.argument('[file]', 'TypeScript file to run')
  .action(async (file: string | undefined) => {
    let targetFile = file || await promptForFilename();
    if (!existsSync(targetFile)) {
      await createExampleFile(targetFile);
      console.log(chalk.green(`\n✨ Created ${targetFile}\n`));
    }
    await runPlayground(targetFile);
  });
program.parse();
