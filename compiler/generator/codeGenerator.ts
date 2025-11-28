import { TokenType } from "../lib/consts"

const prevTypes = [
  TokenType.Identifier,
  TokenType.Keyword,
  TokenType.Number,
  TokenType.String,
  TokenType.Template,
  TokenType.JSXText,
  TokenType.JSXIdentifier,
]

const currTypes = [...prevTypes, TokenType.JSXTagStart]

const semiTokenType = [TokenType.Identifier, TokenType.Keyword, TokenType.Number]

const change: any = {
  [TokenType.Keyword]: { fn: `function` },
  [TokenType.Punctuator]: { "==": `===`, "!=": `!==` },
  [TokenType.Identifier]: {
    print: `console.log`,
    err: `console.error`,
  },
}

export class CodeGenerator {
  i = 0
  tokens

  static generate(tokens: Token[]) {
    const cgen = new CodeGenerator(tokens)
    const buf = []
    let code
    while ((code = cgen.next())) {
      buf.push(code)
    }
    return buf.join(``)
  }

  changeTokenValue() {
    // length
    if (this.i > 0 && this.i + 1 < this.tokens.length)
      if (this.peek(-1).value === `.` && this.peek().value === `len` && this.peek(1).value !== `.`) {
        return `length`
      }

    // Template
    if (this.peek().type === TokenType.Template) {
      return `\`${this.peek().value.slice(1, -1)}\``
    }

    // from arr
    return change[this.peek().type]?.[this.peek().value] || this.peek().value
  }

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  next(): string | null {
    if (this.i >= this.tokens.length) return null

    // Comment
    if (this.peek().type === TokenType.Comment) {
      this.i++
      return this.next()
    }

    let out = ``

    if (this.i > 0) {
      const prev = this.peek(-1)

      // Jeśli poprzedni i obecny token wymagają separacji => dodaj spację
      if (prevTypes.includes(prev.type) && currTypes.includes(this.peek().type)) {
        out = " "
      }

      // Jeśli poprzedni token kończy się } ] ) lub " a następny zaczyna się od Identifier / Keyword / Number => dodaj średnik
      if (
        (["}", "]", ")", `"`].includes(prev.value.at(-1)!) && semiTokenType.includes(this.peek().type)) ||
        (prev.value === `"` && [TokenType.Keyword].includes(this.peek().type))
      ) {
        out = ";"
      }
    }

    // For loop
    if (this.peek().type === TokenType.Keyword && this.peek().value === `for`) {
      const buf = []

      for (let inLoop = 0; inLoop < 2; this.i++) {
        buf.push(this.peek())
        if (this.peek().type === TokenType.Punctuator && this.peek().value === `|`) {
          inLoop++
        }
      }

      return out + handleForLoop(buf)
    }

    out += this.changeTokenValue()
    this.i++
    return out
  }

  peek(n = 0) {
    return this.tokens[this.i + n]
  }
}

function handleForLoop(tokens: Token[]) {
  tokens = tokens.slice(2)

  const idents = []
  let inIndets = false
  for (const t of tokens) {
    if (t.type === TokenType.Punctuator && t.value === `|`) inIndets = true
    if (inIndets && t.type === TokenType.Identifier) idents.push(t.value)
  }

  let start = ``,
    end = ``
  let inStart = true
  for (const t of tokens) {
    if (t.type === TokenType.Punctuator && t.value === `..`) inStart = false
    else if (t.type === TokenType.Punctuator && t.value === `)`) break
    else if (inStart) start += t.value
    else end += t.value
  }

  if (tokens.find((t) => t.type === TokenType.Punctuator && t.value === `..`)) {
    return `for(let ${idents[0]} = ${start}; ${idents[0]} < ${end}; ${idents[0]} += 1)`
  }

  if (idents[0] === `_`) return `for(const ${idents[1]} in ${start})`
  else if (!idents[1]) return `for(const ${idents[0]} of Object.values(${start}))`
  return `for(const [${idents[1]}, ${idents[0]}] of Object.entries(${start}))`
}
