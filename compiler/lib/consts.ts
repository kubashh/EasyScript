import fs from "fs";
import path from "path";
import child_process from "child_process";

export { fs, path, child_process };

export function FileSync(path: string) {
  return new CFileSync(path);
}

class CFileSync {
  path;

  constructor(path: string) {
    this.path = path;
  }

  text() {
    return String(fs.readFileSync(this.path));
  }

  json() {
    return JSON.parse(this.text());
  }

  write(text: string) {
    const arr = this.path.split(`/`);
    for (let i = 0; i < arr.length - 1; i++) {
      if (!fs.existsSync(arr[i])) fs.mkdirSync(arr[i]);
    }
    fs.writeFileSync(this.path, text);
  }

  exists() {
    return fs.existsSync(this.path);
  }

  delete() {
    fs.unlinkSync(this.path);
  }
}

export enum TokenType {
  Identifier = "Identifier",
  Number = "Number",
  String = "String", // to implement
  Template = "Template", // to implement
  RegExpLiteral = "RegExpLiteral", // to implement
  Punctuator = "Punctuator",
  Keyword = "Keyword",
  Comment = "Comment", // to implement
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
  "const", // declaration
  "var",
  "class",
  "fn",
  "this", // class keywords
  "super",
  "return", // return
  "continue",
  "break",
  "if", // if
  "else",
  "switch",
  "case", // to delete
  "for", // loops
  "while",
  "do",
  "extends", // class
  "new",
  "import", // import / export
  "export",
  "from", // to delete
  "async", // async / await // to delete
  "await", // to delete
  "in", // compere
  "instanceof",
  "typeof",
  "throw", // errors
  "try",
]);

export const jsKeywords = new Set(
  [
    "await",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
    "yield",
  ].filter((word) => !esKeywords.has(word)),
);

export const punctuators = new Set(
  [
    "...",
    "..",
    "?.",
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
  ].sort((a, b) => b.length - a.length),
);
