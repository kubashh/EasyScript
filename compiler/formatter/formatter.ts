import { TokenType } from "../lib/consts";

const IND = "  ";

export class Formatter {
  i = 0;
  indent = 0;
  tokens;

  static format(tokens: Token[]): string {
    const fmt = new Formatter(tokens);
    const buf = [];
    let code;
    while ((code = fmt.next())) {
      buf.push(code);
    }
    buf.push("\n");
    return buf.join(``);
  }

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  next() {
    let out = "";

    if (this.peek().type === TokenType.EOF) return null;

    // Zmniejszamy wcięcie po "}"
    if (this.peek().value === "}") this.indent--;

    if (this.i > 0) {
      // nowa linia przed pewnymi tokenami
      if (isLineBreakPoint(this.peek(-1), this.peek())) {
        out += "\n" + IND.repeat(this.indent);
      }

      // wstaw spację jeśli potrzeba
      if (needSpace(this.peek(-1), this.peek())) {
        out += " ";
      }
    }

    out += this.peek().value;

    // zwiększamy wcięcie po "{"
    if (this.peek().value === "{") {
      this.indent++;
    }

    this.i++;

    return out.trimEnd();
  }

  peek(n = 0) {
    return this.tokens[this.i + n];
  }
}

function needSpace(a: Token, b: Token) {
  // JS/TS identifiers, numbers etc.
  const word = [TokenType.Identifier, TokenType.Keyword, TokenType.Number, TokenType.String];
  const jsxWord = [TokenType.JSXText, TokenType.JSXIdentifier];

  if (word.includes(a.type) && word.includes(b.type)) return true;
  if (word.includes(a.type) && jsxWord.includes(b.type)) return true;
  if (jsxWord.includes(a.type) && word.includes(b.type)) return true;

  // return <Fragment>
  if (a.type === TokenType.Keyword && b.type === TokenType.JSXFragmentStart) return true;

  // between JSX text and tags
  if (a.type === TokenType.JSXText && b.type === TokenType.JSXTagStart) return true;
  if (a.type === TokenType.JSXTagEnd && b.type === TokenType.JSXText) return true;

  return false;
}

function isLineBreakPoint(prev: Token, token: Token) {
  if (
    ["{", "}", ";"].includes(prev.value) ||
    [TokenType.JSXFragmentEnd, TokenType.Comment].includes(prev.type)
  )
    return true;

  // średnik w sytuacjach wymagających separacji (ASI)
  if (
    (["]", ")", `"`].includes(prev.value.at(-1)!) || prev.type === TokenType.String) &&
    tokenNeedsSemicolonBefore(token)
  )
    return true;

  return false;
}

const tokenNeedsSemicolonBefore = (t: Token) =>
  t.type === TokenType.Identifier ||
  t.type === TokenType.Keyword ||
  t.type === TokenType.Number ||
  t.type === TokenType.JSXTagStart;
