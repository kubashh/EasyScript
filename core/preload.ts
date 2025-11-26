// @ts-nocheck

export function Err(...args: any[]): never {
  console.error(...args)
  process.exit()
}

Object.deleteProperty = Reflect.deleteProperty
Object.clear = function (obj: any) {
  for (const key in obj) delete obj[key]
}
