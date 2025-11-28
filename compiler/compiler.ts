import { FileSync, fs, path } from "./lib/consts"
import { info, spawnSync } from "./lib/util"
import { Formatter } from "./formatter/formatter"
import { Err } from "../core/preload"
import { CodeGenerator } from "./generator/codeGenerator"
import { Tokenizer } from "./tokenizer/tokenizer"

export class Compiler {
  static fmt: boolean
  static tokTime: number
  static genTime: number
  static fmtTime: number

  static compile(mainPath: string) {
    Compiler.tokTime = 0
    Compiler.genTime = 0
    Compiler.fmtTime = 0

    Compiler.fmt = process.argv.includes(`-f`)
    const run = process.argv.includes(`-r`)

    for (const path of Compiler.getPaths()) {
      if (path.endsWith(`.es`)) {
        Compiler.file({
          path: path,
          outpath: getOutpath(path),
          text: FileSync(path).text(),
        })
      } else {
        fs.cpSync(path, getOutpath(path))
      }
    }

    info(`Tokenize - ${Compiler.tokTime.toFixed(0)}ms`)
    info(`Code generation - ${Compiler.genTime.toFixed(0)}ms`)
    info(`Compile - ${(Compiler.tokTime + Compiler.genTime).toFixed(0)}ms`)
    if (Compiler.fmt) info(`Formatting - ${Compiler.fmtTime.toFixed(0)}ms`)

    if (run) {
      const start = performance.now()
      info(`Running...`)

      spawnSync({
        cmd: [getOutpath(mainPath).split(`/`).slice(1).join(`/`)],
        runtime: true,
        cwd: `dist`,
        stdio: `inherit`,
      })

      const timePassed = performance.now() - start
      info(`Running JS - ${timePassed.toFixed(0)}ms`)
    }
  }

  static getPaths() {
    const ignorePaths = [`pack.json`, `dist/package.json`, `easyscript.js`]
    const paths: string[] = []
    const outPaths: string[] = []

    for (const path of scanFiles(`.`)) {
      if (ignorePaths.includes(path) || !path.includes(`.`)) continue
      const outpath = getOutpath(path)
      if (outPaths.includes(outpath)) Err(`Same names of files at ${path}! File names must me diffrent`)
      outPaths.push(outpath)
      paths.push(path)
    }

    return paths
  }

  static file(file: ESFile) {
    const { out, formatted } = Compiler.compileCode(file.text)

    FileSync(file.outpath).write(out)

    if (formatted) FileSync(file.path).write(formatted)
  }

  // For future browser ES compiling (no fs)
  static compileCode(text: string) {
    let start = performance.now()
    const tokens = Tokenizer.tokenize(text)
    Compiler.tokTime += performance.now() - start

    start = performance.now()
    const out = CodeGenerator.generate(tokens)
    Compiler.genTime += performance.now() - start

    start = performance.now()
    const formatted = Compiler.fmt ? Formatter.format(tokens) : null
    // console.log(formatted)
    Compiler.fmtTime += performance.now() - start

    return { out, formatted }
  }
}

function getOutpath(path: string) {
  let outpath = `dist/${path}`
  if (path.endsWith(`.es`) || path.endsWith(`.js`) || path.endsWith(`.jsx`) || path.endsWith(`.ts`)) {
    const p = outpath.split(`.`)
    p.splice(-1, 1, `tsx`)
    return p.join(`.`)
  }
  return outpath
}

const excludeDirs = [`node_modules`, `package.json`]
// Function to recursively scan files in a directory
function scanFiles(dirPath: string) {
  if (excludeDirs.includes(dirPath)) return []
  if (!fs.existsSync(dirPath)) {
    Err(`Directory '${dirPath}' does not exist.`)
  }
  const filesList: string[] = [] // Array to store file paths

  // Read contents of the directory
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file) // Get the full file path

    // Check if it's a directory
    if (fs.statSync(fullPath).isDirectory()) {
      // Recursively scan subdirectories
      filesList.push(...scanFiles(fullPath))
    } else {
      // It's a file, add it to the list
      filesList.push(fullPath)
    }
  })

  return filesList
}
