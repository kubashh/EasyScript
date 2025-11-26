# EasyScript (@kubashh/easyscript)

## 0.2.0

- dependence in Node api's (implementing in Node, Bun, Deno => cross runtime)

- fix: CodeGenerator `;` missing after `}` `"` (js runtime error)
- fix: CodeGenerator `for` loop key and value in objects/strings
- fix: RunMode spawnSync runtime error, now `bun` `node` `deno` `npm` `pnpm` `yarn` supported

## 0.1.1

- working prototype compiling to TSX
- primitive formatter
- lexer
- tokenizer
- dependence on Bun runtime

- fix: 0.1.0 instant crash (so I must remove 0.1.0)
