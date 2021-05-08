// Function, ...any => Function  
// Partially applies a function.
const partial = (fn, ...argsNow) => (...argsLater) => fn(...argsNow, ...argsLater)

// [[k1, v1], [k1, v1], [k1, v2], ...] => { k1: [v1, v1, v2, ...], ... }  
// Returns an Object mapping String|Symbol keys to Arrays of values.
const collect = keyVals => keyVals.reduce((acc, [k, v]) => {
  acc[k] ??= []
  acc[k].push(v)
  return acc
}, {})

// [[k1, v1], [k1, v1], [k1, v2], ...] => { k1: Set(v1, v2, ...), ... }  
// Like collect(), but aggregates values into Sets.
const collectUnique = keyVals => keyVals.reduce((acc, [k, v]) => {
  acc[k] ??= new Set()
  acc[k].add(v)
  return acc
}, {})

// Number, Function, String (optional) => undefined
// Call a sync|async function a number of times and log the total duration to the console.
const logTime = async (times, fn, timerId = `${Date.now()}-${Math.random()}`) => {
  console.time(timerId)
  for (let i = 1; i <= times; i++) { await fn() }
  console.timeEnd(timerId)
}

export { partial, collect, collectUnique, logTime }
