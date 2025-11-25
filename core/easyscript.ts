import { cpSync, existsSync, rmSync } from "fs"
import { Compiler } from "../compiler/compiler"
import { setPack } from "../compiler/lib/util"
import { Err } from "./preload"

const path = process.argv[2]

if (!path) Err(`Specicy path run "easyscript path"!`)

if (existsSync(`dist`)) rmSync(`dist`, { recursive: true })

await setPack()

const ignore = [`pack.json`, `dist/package.json`, `easyscript.js`]

const prevPaths = [] as string[]
const glob = new Bun.Glob(`**/*`)
for (const path of glob.scanSync(`.`)) {
  if (ignore.includes(path) || !path.includes(`.`)) continue
  let outpath = `dist/${path}`
  if (path.endsWith(`.es`) || path.endsWith(`.js`) || path.endsWith(`.jsx`) || path.endsWith(`.ts`)) {
    const p = outpath.split(`.`)
    p.splice(-1, 1, `tsx`)
    outpath = p.join(`.`)
  }
  if (prevPaths.includes(path)) Err(`Same names of files at ${path}!`)
  prevPaths.push(outpath)
  if (path.endsWith(`.es`)) {
    await Compiler.file({
      path: path,
      outpath,
      text: await Bun.file(path).text(),
      out: ``,
    })
  } else {
    cpSync(path, outpath)
  }
}
