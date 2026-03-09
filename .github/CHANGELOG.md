# EasyScript

## TODO (Rodemap)

### In progres

## Big

- Cache
- Rewrite to ES
- VSCode extenction
- Bundle to 1 js file
- Code format
- no async/await; use instead push
- string template

- Inequalities

JavaScript

```ts
6 < 7 < 5; // true (bad behaviour), because (6 < 7 < 5) = (true < 5) = (1 < 5) = true
```

EasyScript

```es
6 < 7 < 5; // false (good behaviour), because (6 < 7 < 5) = (6 < 7) && (7 < 5) = true && false = false
```

## Small

- Object.deleteProperty
- CodeGenerator: jsKeyword => \_\_jsKeyword
- \`${}\` into "\\{}"
- Lexer/Tokenizer comment Token; token.type = Comment
- for(arr) |e, i| => for(arr; e, i)
- imports => const fs = import("fs")
- array/string negative index // arr[-2]
- array/string slice // arr[2..4]
- globally awilable node api's?

## 0.2.2-dev

## 0.2.1

- fix: copy of `node_modules` `bun.lock`
- compiler: optymalizations
- compiler -i flag (ignore messages)
- Formatter do not delete comments
- Str/Arr.length => .len

## 0.2.0

- dependence in Node api's (implemented in Node, Bun, Deno => cross runtime)

- fix: CodeGenerator `;` missing after `}` `"` (js runtime error)
- fix: CodeGenerator `for` loop key and value in objects/strings
- fix: RunMode spawnSync runtime error, now `bun` `node` `deno` `npm` `pnpm` `yarn` supported

## 0.1.1

- working prototype compiling to TSX
- primitive formatter
- lexer
- tokenizer
- dependence on Bun runtime
- secial `for` loop
- special strictness

- fix: 0.1.0 instant crash (so I must remove 0.1.0)
