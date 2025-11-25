import { TokenType } from "../lib/consts"

const IND = "  "

export class Formatter {
  static format(tokens: Token[]): string {
    let out = ""
    let prev: Token | null = null
    let indent = 0

    for (const token of tokens) {
      if (token.type === TokenType.EOF) break

      // Zmniejszamy wcięcie po "}"
      if (token.value === "}") indent--

      // nowa linia przed pewnymi tokenami
      if (prev && isLineBreakPoint(prev)) {
        out += "\n" + IND.repeat(indent)
      }

      // średnik w sytuacjach wymagających separacji (ASI)
      if (
        prev &&
        (prev.value.endsWith("]") || prev.value.endsWith(")") || prev.type === TokenType.String) &&
        tokenNeedsSemicolonBefore(token)
      ) {
        out += ";"
        out += "\n" + IND.repeat(indent)
      }

      // wstaw spację jeśli potrzeba
      if (prev && needSpace(prev, token)) {
        out += " "
      }

      out += token.value

      // zwiększamy wcięcie po "{"
      if (token.value === "{") {
        indent++
      }

      prev = token
    }

    return out.trimEnd() + "\n"
  }
}

function needSpace(a: Token, b: Token) {
  // JS/TS identifiers, numbers etc.
  const word = [TokenType.Identifier, TokenType.Keyword, TokenType.Number, TokenType.String]
  const jsxWord = [TokenType.JSXText, TokenType.JSXIdentifier]

  if (word.includes(a.type) && word.includes(b.type)) return true
  if (word.includes(a.type) && jsxWord.includes(b.type)) return true
  if (jsxWord.includes(a.type) && word.includes(b.type)) return true

  // return <Fragment>
  if (a.type === TokenType.Keyword && b.type === TokenType.JSXFragmentStart) return true

  // between JSX text and tags
  if (a.type === TokenType.JSXText && b.type === TokenType.JSXTagStart) return true
  if (a.type === TokenType.JSXTagEnd && b.type === TokenType.JSXText) return true

  return false
}

const isLineBreakPoint = (t: Token) =>
  t.value === "{" || t.value === "}" || t.value === ";" || t.type === TokenType.JSXFragmentEnd

const tokenNeedsSemicolonBefore = (t: Token) =>
  t.type === TokenType.Identifier ||
  t.type === TokenType.Keyword ||
  t.type === TokenType.Number ||
  t.type === TokenType.JSXTagStart
