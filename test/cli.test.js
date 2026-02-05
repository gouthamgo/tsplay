import { test, describe } from 'node:test';
import assert from 'node:assert';
import { execSync, spawn } from 'node:child_process';
import { existsSync, unlinkSync, mkdirSync, rmdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = join(__dirname, '..', 'dist', 'index.js');
const TEST_DIR = join(__dirname, 'tmp');

// Helper to run CLI and get output
function runCLI(args = '', options = {}) {
  try {
    const result = execSync(`node ${CLI_PATH} ${args}`, {
      encoding: 'utf-8',
      timeout: 5000,
      ...options
    });
    return { stdout: result, exitCode: 0 };
  } catch (error) {
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      exitCode: error.status || 1
    };
  }
}

// Setup and teardown
function setup() {
  if (!existsSync(TEST_DIR)) {
    mkdirSync(TEST_DIR, { recursive: true });
  }
}

function cleanup() {
  if (existsSync(TEST_DIR)) {
    const files = ['test.ts', 'nested/deep.ts'];
    files.forEach(f => {
      const path = join(TEST_DIR, f);
      if (existsSync(path)) unlinkSync(path);
    });
    try {
      rmdirSync(join(TEST_DIR, 'nested'));
    } catch {}
    try {
      rmdirSync(TEST_DIR);
    } catch {}
  }
}

describe('CLI', () => {
  test('--help shows usage information', () => {
    const { stdout } = runCLI('--help');
    assert.ok(stdout.includes('Usage:'), 'Should show usage');
    assert.ok(stdout.includes('tsplay'), 'Should show command name');
    assert.ok(stdout.includes('TypeScript'), 'Should mention TypeScript');
  });

  test('--version shows version number', () => {
    const { stdout } = runCLI('--version');
    assert.match(stdout.trim(), /^\d+\.\d+\.\d+$/, 'Should show semver version');
  });

  test('rejects non-.ts files', () => {
    const { stderr, exitCode } = runCLI('test.js', { cwd: TEST_DIR });
    assert.strictEqual(exitCode, 1, 'Should exit with code 1');
  });
});

describe('File Creation', () => {
  test('creates example file when file does not exist', async () => {
    setup();
    const testFile = join(TEST_DIR, 'newfile.ts');

    // Clean up if exists
    if (existsSync(testFile)) unlinkSync(testFile);

    // Start the CLI and kill it after file creation
    const child = spawn('node', [CLI_PATH, testFile], {
      cwd: TEST_DIR,
      stdio: 'pipe'
    });

    // Wait a bit for file to be created
    await new Promise(resolve => setTimeout(resolve, 1000));
    child.kill();

    assert.ok(existsSync(testFile), 'Should create the file');

    const content = readFileSync(testFile, 'utf-8');
    assert.ok(content.includes('TypeScript Playground'), 'Should have template content');

    // Cleanup
    unlinkSync(testFile);
    cleanup();
  });
});

describe('TypeScript Execution', () => {
  test('executes TypeScript file and shows output', async () => {
    setup();
    const testFile = join(TEST_DIR, 'hello.ts');
    writeFileSync(testFile, 'console.log("HELLO_TEST_OUTPUT");');

    const child = spawn('node', [CLI_PATH, testFile], {
      cwd: TEST_DIR,
      stdio: 'pipe'
    });

    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    // Wait for execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    child.kill();

    assert.ok(output.includes('HELLO_TEST_OUTPUT'), 'Should show TypeScript output');

    // Cleanup
    unlinkSync(testFile);
    cleanup();
  });
});
