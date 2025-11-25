import { cpSync, existsSync, rmSync } from "fs"

if (existsSync(`workspace`)) rmSync(`workspace`, { recursive: true })

await Bun.$`bun scripts/build.ts --dev`

cpSync(`example`, `workspace`, { recursive: true })

await Bun.$`cd workspace && bun easyscript.js main.es`

await Bun.$`cd workspace/dist && bun main.tsx`
