import { cpSync, existsSync, rmSync } from "fs";

if (existsSync(`workspace`)) rmSync(`workspace`, { recursive: true });

await Bun.$`bun scripts/build.ts --dev`;

cpSync(`example`, `workspace`, { recursive: true });

Bun.spawnSync({
  cmd: [`bun`, `easyscript.js`, `main.es`, ...process.argv.slice(2)],
  cwd: `workspace`,
  stdout: `inherit`,
  stderr: `inherit`,
});
