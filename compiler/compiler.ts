import { FileSync, fs, path } from "./lib/consts"
import { spawnSync } from "./lib/util"
import { Formatter } from "./formatter/formatter"
import { Err } from "../core/preload"
import { CodeGenerator } from "./generator/codeGenerator"
import { Lexer } from "./lexer/lexer"

export class Compiler {
  static fmt: boolean

  static compile(path: string) {
    const ignore = [`pack.json`, `dist/package.json`, `easyscript.js`]

    Compiler.fmt = process.argv.includes(`-f`)
    const run = process.argv.includes(`-r`)

    const prevPaths = [] as string[]
    for (const path of scanFiles(`.`)) {
      if (ignore.includes(path) || !path.includes(`.`)) continue
      const outpath = getOutpath(path)
      if (prevPaths.includes(path)) Err(`Same names of files at ${path}!`)
      prevPaths.push(outpath)
      if (path.endsWith(`.es`)) {
        Compiler.file({
          path: path,
          outpath,
          text: FileSync(path).text(),
        })
      } else {
        fs.cpSync(path, outpath)
      }
    }

    if (run) {
      console.log(`Running...`)

      spawnSync({
        cmd: [getOutpath(path).split(`/`).slice(1).join(`/`)],
        runtime: true,
        cwd: `dist`,
        stdio: `inherit`,
      })
    }
  }

  static file(file: ESFile) {
    const tokens = Lexer.lex(file.text)
    const code = CodeGenerator.generate(tokens)

    FileSync(`test.json`).write(JSON.stringify(tokens))

    FileSync(file.outpath).write(code)

    if (Compiler.fmt) {
      console.log(`Formatting...`)
      const fmt = Formatter.format(tokens)
      FileSync(file.path).write(fmt)
      // console.log(file.text)
      // console.log(code)
    }
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

// Function to recursively scan files in a directory
function scanFiles(dirPath: string) {
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
