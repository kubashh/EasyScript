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
  static i = 0

  static generate(tokens: Token[]): string {
    let code = ""
    let prev: Token | null = null
    const prevStack = []

    const forLoop = {
      inLoop: 0,
      buf: [] as Token[],
    }

    for (CodeGenerator.i = 0; CodeGenerator.i < tokens.length; CodeGenerator.i++) {
      const token = tokens[CodeGenerator.i]
      if (token.type === TokenType.EOF) continue

      if (prev) {
        // Jeśli poprzedni i obecny token wymagają separacji → dodaj spację
        if (prevTypes.includes(prev.type) && currTypes.includes(token.type)) {
          code += " "
        }

        // Jeśli poprzedni token kończy się } ] lub ) a następny zaczyna się od Identifier / Keyword / Number → dodaj średnik
        if (
          ((prev.value.endsWith("}") || prev.value.endsWith("]") || prev.value.endsWith(")")) &&
            semiTokenType.includes(token.type)) ||
          (prev.value === `"` && [TokenType.Keyword].includes(token.type))
        ) {
          code += ";"
        }
      }

      if (token.type === TokenType.Keyword && token.value === `for`) {
        forLoop.inLoop = 2
      }
      if (forLoop.inLoop) {
        forLoop.buf.push(token)
        if (token.type === TokenType.Punctuator) {
          if (token.value === `|`) {
            forLoop.inLoop--
            if (!forLoop.inLoop) {
              code += handleForLoop(forLoop.buf)
              forLoop.buf = []
            }
          }
        }
      } else code += CodeGenerator.changeTokenValue(token)

      prev = token
      prevStack.push(token)
    }

    return code
  }

  static changeTokenValue(token: Token) {
    return change[token.type]?.[token.value] || token.value
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
