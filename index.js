/**
 * Partially apply a function.
 * @param {function} fn - Function to partially apply.
 * @param {...*} args - Arguments to apply.
 * @returns {function} Function with the provided arguments applied.
 */
const partial = (fn, ...args) => (...argsLater) => fn(...args, ...argsLater)

/**
 * Collect values with the same key and return an object with a one-to-many key-value relationship.
 * @param {array<array<(string|symbol), *>>} keyVals - Key-value pairs to reduce over.
 * @returns {object<(string|symbol), array<*>>} Object mapping keys to arrays of values.
 */
const collect = keyVals => keyVals.reduce((acc, [k, v]) => {
  acc[k] ??= []
  acc[k].push(v)
  return acc
}, {})

/**
 * Like collect(), but eliminates duplicate values (based on set behavior).
 * @param {array<array<(string|symbol), *>>} keyVals - Key-value pairs to reduce over.
 * @returns {object<(string|symbol), set<*>>} Object mapping keys to sets of unique values.
 */
const collectUnique = keyVals => keyVals.reduce((acc, [k, v]) => {
  acc[k] ??= new Set()
  acc[k].add(v)
  return acc
}, {})

/**
 * Call a function a number of times and log the total duration to the console.
 * @async
 * @param {number} times - The number of times to call a given function; useful for amplifying differences in execution time between functions.
 * @param {function} fn - The function to call; may be synchronous or asynchronous.
 * @param {string} [timerId] An id/label for the console timer; shows up in the log.
 * @returns {undefined} Function called for side-effect only.
 */
const logTime = async (times, fn, timerId = `${Date.now()}-${Math.random()}`) => {
  console.time(timerId)
  for (let i = 1; i <= times; i++) { await fn() }
  console.timeEnd(timerId)
}

export { partial, collect, collectUnique, logTime }
