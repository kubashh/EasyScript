import { Compiler } from "../compiler/compiler"

const arr = [
  ` import fs from "fs"`, // import
  ` var a = 10`, // var
  ` const a = "fff"`, // const
  ` for(0..10) |i| print(i)`, // for(0..10)
  ` const arr = [1, 2, 3, 4]
    for(arr) |e| print(e)`, // for(arr)
  ` const arr = [1, 2, 3, 4]
    for(arr) |e, index| print(e, index)`, // for(arr)
  ` //const arr = [1, 2, 3, 4]
    print(10)`, // comment
]

for (const e of arr) {
  await Compiler.file({
    path: `./dist.ts`,
    outpath: `./dist.ts`,
    text: e,
  })
}
