// 🎮 TypeScript Playground
const name: string = "Learner";
console.log(`👋 Hello ${name}!`);

interface Dev { name: string; skills: string[]; }
const me: Dev = { name: "You", skills: ["TS", "JS", "Node"] };
console.log(`💪 Skills: ${me.skills.join(", ")}`);

function greet(n: string): string { return `Hello ${n}!`; }
console.log(greet("World"));


console.log(22);