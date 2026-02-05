#!/usr/bin/env node
import { program } from 'commander';
import { runPlayground } from './runner.js';
import { createExampleFile } from './templates.js';
import chalk from 'chalk';
import { existsSync, statSync } from 'fs';
import * as readline from 'readline';
import { resolve, isAbsolute } from 'path';

async function promptForFilename(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(chalk.cyan('📝 Enter filename (e.g., learn.ts): '), (answer) => {
      rl.close();
      const filename = answer.trim() || 'playground.ts';
      resolve(filename.endsWith('.ts') || filename.endsWith('.tsx') ? filename : `${filename}.ts`);
    });
  });
}

function validateFilePath(file: string): string | null {
  // Ensure .ts or .tsx extension
  if (!file.endsWith('.ts') && !file.endsWith('.tsx')) {
    return 'File must have a .ts or .tsx extension';
  }

  // Resolve to absolute path
  const absolutePath = isAbsolute(file) ? file : resolve(process.cwd(), file);

  // Check if file exists and is actually a file
  if (existsSync(absolutePath)) {
    try {
      const stats = statSync(absolutePath);
      if (!stats.isFile()) {
        return 'Path exists but is not a file';
      }
    } catch {
      return 'Unable to access file';
    }
  }

  return null;
}

program.name('tsplay').description('🎮 TypeScript Playground').version('1.0.0');
program.argument('[file]', 'TypeScript file to run (.ts or .tsx)')
  .action(async (file: string | undefined) => {
    let targetFile = file || await promptForFilename();

    // Add .ts extension if missing
    if (!targetFile.endsWith('.ts') && !targetFile.endsWith('.tsx')) {
      targetFile = `${targetFile}.ts`;
    }

    const validationError = validateFilePath(targetFile);
    if (validationError) {
      console.error(chalk.red(`❌ ${validationError}`));
      process.exit(1);
    }

    if (!existsSync(targetFile)) {
      await createExampleFile(targetFile);
      console.log(chalk.green(`\n✨ Created ${targetFile}\n`));
    }
    await runPlayground(targetFile);
  });
program.parse();
