// import { Formatter } from "./formatter/formatter"
import { CodeGenerator } from "./generator/codeGenerator"
import { Lexer } from "./lexer/lexer"

export class Compiler {
  static async file(file: ESFile) {
    const tokens = Lexer.lex(file.text)
    const code = CodeGenerator.generate(tokens)
    // const fmt = Formatter.format(tokens)
    // // console.log(file.text)
    // // console.log(code)

    // console.log(fmt)
    await Bun.write(`test.json`, JSON.stringify(tokens))

    file.out = code

    await save(file)
  }
}

async function save({ outpath, out }: ESFile) {
  await Bun.write(outpath, out)
}
