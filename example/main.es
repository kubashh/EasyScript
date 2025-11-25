// import {hello} from "./t";

const arr = [1, 2, 3, 4]

for(arr) |e, i| {
  print(i, e)
}

for(arr) |e| {
  print(e)
}

for(arr) |_, i| {
  print(i)
}

// fn a() {}

// console.log(arr)
// for(arr) |e, index| print(e, index)
