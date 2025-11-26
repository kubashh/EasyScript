type Obj<T> = Record<string, T>

type EasyScriptConfig = {
  publish: ESCPublish | false
  scripts: Obj<T>
  deps: Obj<T>
  [string]: string
}

type ESCPublish = {
  name: string
  version: string
  author: string
  description: string
  repository: string
  license: string
  files: string[]
  keywords: string[]
  bin: Obj<string> | string
  [string]: string
}
