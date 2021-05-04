// (Function, any, ...) => Function  
// Partially applies a function
const partial = (fn, ...argsNow) => (...argsLater) => fn(...argsNow, ...argsLater)

// Array => Array  
// Returns an Array with no duplicates, following the behavior of Sets.
const unique = arr => [...new Set(arr)]

// [[k1, v1], [k1, v1], [k1, v2], ...] => { k1: [v1, v1, v2, ...], ... }  
// Returns an Object with a one(key)-to-many(values) relationship
const collect = keyVals => keyVals.reduce((acc, [k, v]) => {
  acc[k] ??= []
  acc[k].push(v)
  return acc
}, {})

// [[k1, v1], [k1, v1], [k1, v2], ...] => { k1: [v1, v2, ...], ... }  
// Like collect(), but passes the Array-values through unique()
const collectUnique = keyVals =>
  Object.fromEntries(Object.entries(collect(keyVals)).map(([k, v]) => [k, unique(v)]))

export { partial, unique, collect, collectUnique }
