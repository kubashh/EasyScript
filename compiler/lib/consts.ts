import fs from "fs"
import path from "path"
import child_process from "child_process"

export { fs, path, child_process }

export function FileSync(path: string) {
  return new CFileSync(path)
}

class CFileSync {
  path

  constructor(path: string) {
    this.path = path
  }

  text() {
    return String(fs.readFileSync(this.path))
  }

  json() {
    return JSON.parse(this.text())
  }

  write(text: string) {
    const arr = this.path.split(`/`)
    for (let i = 0; i < arr.length - 1; i++) {
      if (!fs.existsSync(arr[i])) fs.mkdirSync(arr[i])
    }
    fs.writeFileSync(this.path, text)
  }

  exists() {
    return fs.existsSync(this.path)
  }

  delete() {
    fs.unlinkSync(this.path)
  }
}

export enum TokenType {
  Identifier = "Identifier",
  Number = "Number",
  String = "String",
  Template = "Template",
  RegExpLiteral = "RegExpLiteral",
  Punctuator = "Punctuator",
  Keyword = "Keyword",
  Comment = "Comment",
  EOF = "EOF",

  JSXText = "JSXText",
  JSXIdentifier = "JSXIdentifier",
  JSXTagStart = "JSXTagStart",
  JSXTagEnd = "JSXTagEnd",
  JSXSelfClosing = "JSXSelfClosing",
  JSXExpressionStart = "JSXExpressionStart",
  JSXExpressionEnd = "JSXExpressionEnd",
  JSXFragmentStart = "JSXFragmentStart",
  JSXFragmentEnd = "JSXFragmentEnd",
}

export const esKeywords = new Set([
  "fn", // function
  "return", // return
  "if", // if
  "else",
  "switch",
  "for", // loops
  "while",
  "do",
  "const", // declaration
  "var",
  "class",
  "extends", // class
  "new",
  "import", // import / export
  "export",
  "from",
])

export const punctuators = [
  "?.",
  "..",
  "...",
  "==",
  "!=",
  "<=",
  ">=",
  "=",
  "+",
  "-",
  "*",
  "/",
  "%",
  "<",
  ">",
  "(",
  ")",
  "{",
  "}",
  "[",
  "]",
  "|",
  ".",
  ";",
  ":",
  ",",
  "?",
].sort((a, b) => b.length - a.length)
