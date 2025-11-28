import { esKeywords, punctuators, TokenType } from "../lib/consts"

export class Tokenizer {
  private code: string
  private i: number = 0

  static tokenize(code: string) {
    const tokenizer = new Tokenizer(code)
    const tokens: Token[] = []
    let tok: Token | null

    while ((tok = tokenizer.next()) && tok.type !== TokenType.EOF) {
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

  constructor(code: string) {
    this.code = code
  }

  peek(n = 0) {
    return this.code[this.i + n]
  }
  match(s: string) {
    return this.code.startsWith(s, this.i)
  }
  eof() {
    return this.i >= this.code.length
  }

  next(): Token | null {
    if (this.eof()) return { type: TokenType.EOF, value: "", start: this.i, end: this.i }

    const ch = this.code[this.i]

    // --- whitespace ---
    if (/\s/.test(ch)) {
      this.i++
      return this.next()
    }

    // --- comments ---
    if (this.match("//")) {
      const buf = []
      const start = this.i
      while (!this.eof() && this.peek() !== "\n") {
        buf.push(this.peek())
        this.i++
      }
      return { type: TokenType.Comment, value: buf.join(``), start, end: this.i }
    }

    // --- numbers ---
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(this.peek(1)))) {
      const start = this.i
      let s = ""
      while (/[0-9]/.test(this.peek())) s += this.code[this.i++]
      if (this.peek() === "." && this.peek(1) !== `.`) {
        s += this.code[this.i++]
        while (/[0-9]/.test(this.peek())) s += this.code[this.i++]
      }
      return { type: TokenType.Number, value: s, start, end: this.i }
    }

    // Strings
    if (this.match(`"`)) {
      const start = this.i
      let ind = this.i + 1
      while (this.code[ind] !== `"` || this.code[ind - 1] === `\\`) {
        ind = this.code.indexOf(`"`, ind + 1)
      }
      ind++
      const slice = this.code.slice(start, ind)
      this.i = ind
      return {
        type: slice.includes(`\n`) ? TokenType.Template : TokenType.String,
        value: slice,
        start,
        end: this.i,
      }
    }

    // --- identifiers/keywords ---
    if (/[A-Za-z_$]/.test(ch)) {
      const start = this.i
      let s = ""
      while (/[A-Za-z0-9_$]/.test(this.peek())) s += this.code[this.i++]
      return {
        type: esKeywords.has(s) ? TokenType.Keyword : TokenType.Identifier,
        value: s,
        start,
        end: this.i,
      }
    }

    // --- punctuators ---
    for (const p of punctuators) {
      if (this.match(p)) {
        const start = this.i
        this.i += p.length
        return { type: TokenType.Punctuator, value: p, start, end: this.i }
      }
    }

    // --- JSX minimal ---
    if (this.match("<>")) {
      const start = this.i
      this.i += 2
      return { type: TokenType.JSXFragmentStart, value: "<>", start, end: this.i }
    }
    if (this.match("</>")) {
      const start = this.i
      this.i += 3
      return { type: TokenType.JSXFragmentEnd, value: "</>", start, end: this.i }
    }
    if (ch === "<") {
      const start = this.i
      this.i++
      return { type: TokenType.JSXTagStart, value: "<", start, end: this.i }
    }

    // --- default single char punctuator ---
    this.i++
    return { type: TokenType.Punctuator, value: ch, start: this.i - 1, end: this.i }
  }
}
