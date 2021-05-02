// Partially apply a function
const partial = (fn, ...argsNow) => (...argsLater) => fn(...argsNow, ...argsLater)

// When you want a Set but don't want to give up Array methods...
const unique = arr => [...new Set(arr)]

// Return a map with a one (key) to many (values) relationship
// [[k1, v1], [k1, v1], [k1, v2], ...] => { k1: [v1, v1, v2, ...], ... }
const arrayMap = keyVals => keyVals.reduce((acc, [k, v]) => {
  acc[k] ??= []
  acc[k].push(v)
  return acc
}, {})

// Return an array-map with no duplicates in the array-values
// [[k1, v1], [k1, v1], [k1, v2], ...] => { k1: [v1, v2, ...], ... }
const arrayMapUnique = keyVals =>
  Object.fromEntries(Object.entries(arrayMap(keyVals)).map(([k, v]) => [k, unique(v)]))

export { partial, unique, arrayMap, arrayMapUnique }
