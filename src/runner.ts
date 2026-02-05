import { watch } from 'chokidar';
import { spawn } from 'child_process';
import chalk from 'chalk';
import { resolve } from 'path';

export async function runPlayground(file: string): Promise<void> {
  const filePath = resolve(process.cwd(), file);
  let currentProcess: any = null;

  console.log(chalk.blue.bold('🎮 TypeScript Playground'));
  console.log(chalk.gray(`📝 Watching: ${file}\n`));

  const runFile = () => {
    if (currentProcess) currentProcess.kill();
    console.log(chalk.yellow(`[${new Date().toLocaleTimeString()}] Running...\n`));
    console.log(chalk.gray('─'.repeat(50)));
    currentProcess = spawn('npx', ['tsx', filePath], { stdio: 'inherit', shell: true });
    currentProcess.on('exit', () => {
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.green('✅ Watching...\n'));
    });
  };

  runFile();
  watch(filePath, { ignoreInitial: true }).on('change', () => {
    console.log(chalk.cyan('\n📝 File changed...'));
    runFile();
  });

  process.on('SIGINT', () => {
    if (currentProcess) currentProcess.kill();
    console.log(chalk.yellow('\n👋 Bye!'));
    process.exit(0);
  });
}
