import { watch } from 'chokidar';
import { exec } from 'child_process';
import chalk from 'chalk';
import { resolve } from 'path';

export async function runPlayground(file: string): Promise<void> {
  const filePath = resolve(process.cwd(), file);
  let currentProcess: any = null;
  
  console.log(chalk.blue.bold('🎮 TypeScript Playground'));
  console.log(chalk.gray(`📝 Watching: ${file}\n`));
  
  const runFile = () => {
    if (currentProcess) {
      try {
        currentProcess.kill();
      } catch (e) {}
    }
    
    console.log(chalk.yellow(`[${new Date().toLocaleTimeString()}] Running...\n`));
    console.log(chalk.gray('─'.repeat(50)));
    
    // exec handles shell and PATH automatically on all platforms
    currentProcess = exec(`npx tsx "${filePath}"`, (error) => {
      if (error && error.code !== null) {
        console.log(chalk.gray('─'.repeat(50)));
        console.log(chalk.red(`❌ Error: ${error.message}`));
      }
    });
    
    // Pipe output to console
    if (currentProcess.stdout) {
      currentProcess.stdout.pipe(process.stdout);
    }
    if (currentProcess.stderr) {
      currentProcess.stderr.pipe(process.stderr);
    }
    
    currentProcess.on('exit', (code) => {
      console.log(chalk.gray('─'.repeat(50)));
      if (code === 0 || code === null) {
        console.log(chalk.green('✅ Watching...\n'));
      }
    });
  };
  
  runFile();
  
  watch(filePath, { ignoreInitial: true }).on('change', () => {
    console.log(chalk.cyan('\n📝 File changed...'));
    runFile();
  });
  
  process.on('SIGINT', () => {
    if (currentProcess) {
      try {
        currentProcess.kill();
      } catch (e) {}
    }
    console.log(chalk.yellow('\n👋 Bye!'));
    process.exit(0);
  });
}
