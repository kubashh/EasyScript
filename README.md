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
10 == `10` // true, (bad behaviour), because first implementation of JS
false != true // true
10 === `10` // false
false !== true // true
```

```es main.es
10 == `10` // false
false != true // true
```

### `for` loops

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

## Rodemap (TODO)

### 0.1.1 array/string negative index

### 0.1.2 array/string slice

#### 0.2.0 Inequalities

```ts main.ts
6 < 7 < 5 // true (bad behaviour), because (6 < 7 < 5) = (true < 5) = (1 < 5) = true
```

```es main.es
6 < 7 < 5 // false (bad behaviour), because (6 < 7 < 5) = (6 < 7) && (7 < 5) = true && false = false
```

### 0.3.0 Code format

### 0.4.0 Bundle to 1 js file

### 0.5.0 VSCode extenction

### Better compiler
