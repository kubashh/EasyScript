# EasyScript easier JavaScript

## Features

### Changed words

`console.log()` => `print()`
`console.error()` => `err()` | `Err()` (quit program after display message)
`function` => `fn`

`Reflect.deleteProperty` => `Object.deleteProperty` (no need for use Reflect)

### Mathematic comparison

#### Strictness

```ts main.ts
10 == `10`; // true, (bad behaviour), because first implementation of JS
false != true; // true
10 === `10`; // false
false !== true; // true
```

```es main.es
10 == `10`; // false
false != true; // true
```

### `for` loop

#### `for` arrays / objects / strings

```es
const arr = [1, 2, 3, 4]

for(arr) |element, index| {
  print(index, element)
}

for(arr) |element| {
  print(element)
}

for(arr) |_, index| {
  print(index)
}
```

#### `for` range

```es
for(0..10) |i| {
  print(i)
}
```

### Arays/Strings

#### Length

`arr.len` => `arr.length`
`str.len` => `str.length`

# TODO

- More Strict
- 100% typed code

## undefined to null

no `undefined`
types: null, bool (not boolean), number, biging, string, array, object

```ts
function someApi() {
  if (Math.random() < 0.4) return 10;
  return undefined;
}

let myVar = someApi();
```

convert into

```es
function someApi() {
  if (Math.random() < 0.4) return 10;
  return undefined;
}

var myVar = someApi() || null;
```
