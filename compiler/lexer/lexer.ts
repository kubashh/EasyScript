import { esKeywords, TokenType } from "../lib/consts"
import { Tokenizer } from "../tokenizer/tokenizer"

export class Lexer {
  static lex(code: string): Token[] {
    const tokenizer = new Tokenizer(code)
    const tokens: Token[] = []
    let tok: Token | null

    while ((tok = tokenizer.next()) && tok.type !== TokenType.EOF) {
      // rozróżnienie keyword / identifier
      if (tok.type === TokenType.Identifier && esKeywords.has(tok.value)) {
        tok.type = TokenType.Keyword
      }
      tokens.push(tok)
    }
    tokens.push({
      type: TokenType.EOF,
      value: "",
      start: Number(tokenizer.peek()),
      end: Number(tokenizer.peek()),
    })
    return tokens
  }
}
