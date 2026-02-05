import { writeFileSync } from 'fs';
import { dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';

const CODE = `// 🎮 TypeScript Playground
const name: string = "TypeScript Learner";
console.log(\`👋 Hello \${name}!\`);

interface Dev { name: string; skills: string[]; }
const me: Dev = { name: "You", skills: ["TS", "JS", "Node"] };
console.log(\`💪 Skills: \${me.skills.join(", ")}\`);

function greet(n: string): string { return \`Hello \${n}!\`; }
console.log(greet("World"));
`;

export async function createExampleFile(filename: string): Promise<void> {
  const dir = dirname(filename);
  if (dir && dir !== '.' && !existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filename, CODE, 'utf-8');
}
