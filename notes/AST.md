# JavaScript AST Types Categorized

This document categorizes JavaScript Abstract Syntax Tree (AST) node types (ESTree/Babel style) into logical sections for easier reference.

---

## 1. Operators

Used inside `BinaryExpression`, `LogicalExpression`, `AssignmentExpression`, `UpdateExpression`, `UnaryExpression`, etc.

- **Binary Operators:** `+`, `-`, `*`, `/`, `%`, `**`, `==`, `===`, `!=`, `!==`, `<`, `<=`, `>`, `>=`, `in`, `instanceof`
- **Logical Operators:** `||`, `&&`
- **Assignment Operators:** `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `**=`, `<<=`, `>>=`, `>>>=`, `&=`, `|=`, `^=`
- **Unary Operators:** `-`, `!`, `~`, `typeof`, `delete`

---

## 2. Declarations

Nodes that define variables, functions, or classes:

- `VariableDeclaration` → `var`, `const`
- `VariableDeclarator` → defines a single variable
- `FunctionDeclaration` → `fn foo() {}`
- `ClassDeclaration` → `class MyClass {}`
- `ImportDeclaration`, `ExportNamedDeclaration`, `ExportDefaultDeclaration`, `ExportAllDeclaration`

---

## 3. Expressions

Anything that produces a value:

- **Identifiers & References:** `Identifier`
- **Literals:** `Literal` (string, number, boolean, null, regex), `TemplateLiteral`, `TemplateElement`
- **Function & Class Expressions:** `FunctionExpression`, `ArrowFunctionExpression`, `ClassExpression`
- **Object & Array:** `ObjectExpression`, `ArrayExpression`, `Property`, `SpreadElement`
- **Call / New:** `CallExpression`, `NewExpression`
- **Member Access:** `MemberExpression`
- **Conditional:** `ConditionalExpression`
- **Sequence / Comma:** `SequenceExpression`
- **Tagged Templates:** `TaggedTemplateExpression`
- **Yield / Await:** `YieldExpression`, `AwaitExpression`
- **Update & Unary:** `UpdateExpression`, `UnaryExpression`
- **Binary / Logical:** `BinaryExpression`, `LogicalExpression`, `AssignmentExpression`

---

## 4. Statements

Code executed for control flow or effect:

- **Block & Empty:** `BlockStatement`, `EmptyStatement`
- **Expression Statements:** `ExpressionStatement`
- **Control Flow:** `IfStatement`, `SwitchStatement`, `SwitchCase`, `BreakStatement`, `ContinueStatement`, `ReturnStatement`, `ThrowStatement`, `TryStatement`, `CatchClause`, `FinallyClause`
- **Loops:** `ForStatement`, `ForInStatement`, `ForOfStatement`, `WhileStatement`, `DoWhileStatement`
- **Labeled Statement:** `LabeledStatement`
- **Debugger:** `DebuggerStatement`

---

## 5. Patterns / Destructuring

Used in variable/function parameters:

- `Identifier`
- `RestElement`
- `ArrayPattern`
- `ObjectPattern`
- `AssignmentPattern`

---

## 6. Modules / Imports / Exports

- `ImportDeclaration`, `ImportSpecifier`, `ImportDefaultSpecifier`, `ImportNamespaceSpecifier`
- `ExportNamedDeclaration`, `ExportDefaultDeclaration`, `ExportAllDeclaration`

---

## 7. Misc / Meta

- `Program` → root node
- `ThisExpression` → `this`
- `Super` → `super`
- `MetaProperty` → e.g., `new.target`

---

## Example: Categorizing a small JS snippet

```js
const a = 1 + 2
function foo(x) {
  return x * 2
}
```

**AST nodes by section:**

- **Declarations:** `VariableDeclaration`, `VariableDeclarator`, `FunctionDeclaration`, `Identifier`
- **Operators:** `+`, `*`
- **Expressions:** `BinaryExpression`, `Literal`, `ReturnStatement`
- **Statements:** `ExpressionStatement`, `BlockStatement`, `Program`
