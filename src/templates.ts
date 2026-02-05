import { writeFileSync } from 'fs';

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
  writeFileSync(filename, CODE, 'utf-8');
}
