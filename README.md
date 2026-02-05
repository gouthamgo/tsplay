# tsplay

A lightweight TypeScript playground CLI for learning and rapid development. Watch and run TypeScript files instantly with automatic reloading.

## Installation

```bash
npm install -g tsplay
```

## Usage

```bash
# Run with a file (creates it if it doesn't exist)
tsplay myfile.ts

# Run without arguments (interactive prompt)
tsplay
```

When you run `tsplay` with a file that doesn't exist, it creates an example TypeScript file to get you started.

## Features

- **Instant execution** - Run TypeScript files without manual compilation
- **Watch mode** - Automatically re-runs on file changes
- **Auto-generate examples** - Creates starter code for new files
- **Cross-platform** - Works on Windows, macOS, and Linux
- **Colored output** - Clear visual feedback in the terminal

## Requirements

- Node.js >= 18.0.0

## Development

```bash
# Clone and install
git clone https://github.com/gouthamgo/tsplay.git
cd tsplay
npm install

# Development mode (watch)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Local testing
npm link
tsplay
```

## License

MIT
