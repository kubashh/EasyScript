import { child_process, FileSync } from "./consts"
import { Err } from "../../core/preload"

const exampleConf: EasyScriptConfig = {
  publish: {
    name: "example",
    version: "0.0.1",
    author: "nick",
    description: "description",
    repository: "repo",
    license: "MIT",
    files: [],
    keywords: [],
    bin: {},
  },
  scripts: {},
  deps: {},
}

export function setPack() {
  const { publish, deps, ...config } = getConfig()
  const packageJson: Obj<any> = config
  packageJson.dependencies = deps

  if (publish) Object.assign(packageJson, publish)

  FileSync(`dist/package.json`).write(JSON.stringify(packageJson))
}

function getConfig() {
  const file = FileSync(`pack.json`)
  if (!file.exists()) return exampleConf
  const config = file.json()

  // Validate
  validateConfig(config, exampleConf)

  // TODO auto fix config

  return config as EasyScriptConfig
}

function validateConfig(v: any, e: any) {
  if (typeof v !== typeof e) Err(`Config Error !`)
  if (Array.isArray(v) && Array.isArray(e)) return
  if (typeof v === `object`) {
    const keysLeft = Object.keys(v)
    for (const key of Object.keys(e)) {
      if (!(key in v)) Err(`Missing ${key} key!`)
      keysLeft.splice(keysLeft.findIndex((e) => e === key))
    }
    if (keysLeft.length > 0)
      for (const key in keysLeft) {
        delete v[key]
      }
  }
}

const runtimes = [`bun`, `node`, `deno`, `npm`, `yarn`, `pnpm`]
let validRuntime: string | null = null

function getValidRuntime(runtimes: string[]) {
  for (const rt of runtimes) {
    try {
      const a = child_process.spawnSync(rt, {
        timeout: 5,
      })

      if (a.status === 0) return rt
    } catch {}
  }

  Err(`No valid runtime, runtimes:`, runtimes)
}

export function spawnSync({ runtime, cmd, ...options }: spawnSyncOptions) {
  let firstArg = ``
  if (runtime) {
    if (typeof runtime !== `boolean`) validRuntime = getValidRuntime(runtime)
    else if (!validRuntime) validRuntime = getValidRuntime(runtimes)
    firstArg = validRuntime
  } else {
    firstArg = cmd[0]
    cmd = cmd.slice(1)
  }

  if (cmd.length > 0) child_process.spawnSync(firstArg, cmd, options)
  else child_process.spawnSync(firstArg, options)
}

const displayInfo = !process.argv.includes(`-i`)
export function info(...args: any[]) {
  if (displayInfo) console.log(`[EasyScript]`, ...args)
}
