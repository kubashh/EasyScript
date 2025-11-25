import { Err } from "../../core/preload"

const exampleConf = {
  scripts: {},
  deps: {},
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
}

export async function setPack() {
  const { publish, ...config } = await getConfig()
  const packageJson = config

  if (publish) Object.assign(packageJson, publish)

  await Bun.write(`dist/package.json`, JSON.stringify(packageJson))
}

export async function getConfig() {
  const config = await Bun.file(`pack.json`).json()

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
