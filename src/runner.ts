import { watch } from 'chokidar';
import { spawn, type ChildProcess } from 'child_process';
import chalk from 'chalk';
import { resolve } from 'path';

export async function runPlayground(file: string): Promise<void> {
  const filePath = resolve(process.cwd(), file);
  let currentProcess: ChildProcess | null = null;
  let hasError = false;

  console.log(chalk.blue.bold('🎮 TypeScript Playground'));
  console.log(chalk.gray(`📝 Watching: ${file}\n`));

  const killProcess = () => {
    if (currentProcess && !currentProcess.killed) {
      // Use tree-kill pattern for Windows compatibility
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(currentProcess.pid), '/f', '/t'], {
          stdio: 'ignore',
          shell: true
        });
      } else {
        currentProcess.kill('SIGTERM');
      }
      currentProcess = null;
    }
  };

  const runFile = () => {
    killProcess();
    hasError = false;

    console.log(chalk.yellow(`[${new Date().toLocaleTimeString()}] Running...\n`));
    console.log(chalk.gray('─'.repeat(50)));

    // Use spawn with arguments array to prevent command injection
    currentProcess = spawn('npx', ['tsx', filePath], {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true, // Needed for npx on Windows
      cwd: process.cwd()
    });

    currentProcess.stdout?.on('data', (data) => {
      process.stdout.write(data);
    });

    currentProcess.stderr?.on('data', (data) => {
      hasError = true;
      process.stderr.write(data);
    });

    currentProcess.on('error', (err) => {
      hasError = true;
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.red(`❌ Failed to start: ${err.message}`));
    });

    currentProcess.on('exit', (code) => {
      console.log(chalk.gray('─'.repeat(50)));
      if (code === 0 && !hasError) {
        console.log(chalk.green('✅ Watching...\n'));
      } else if (code !== 0) {
        console.log(chalk.red(`❌ Exited with code ${code}\n`));
      }
    });
  };

  runFile();

  watch(filePath, { ignoreInitial: true }).on('change', () => {
    console.log(chalk.cyan('\n📝 File changed...'));
    runFile();
  });

  // Handle graceful shutdown
  const cleanup = () => {
    killProcess();
    console.log(chalk.yellow('\n👋 Bye!'));
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}
