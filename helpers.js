/**
 * Partially apply a function.
 * @param {function} fn - Function to partially apply.
 * @param {...*} args - Arguments to apply.
 * @returns {function} Function with the provided arguments applied.
 */
const partial = (fn, ...args) => (...newArgs) => fn(...args, ...newArgs)

/**
 * Like partial(), but partially apply a function with a the properties of a single options-object.
 * @param {function} fn - Function to partially apply.
 * @param {Object} ob - Options-object arguments to apply; individual properties will be overwritten if the same keys are later passed in a new options object to the partially applied function.
 * @returns {function} Function with the provided options-object argument applied.
 */
const partialOb = (fn, ob) => newOb => fn(Object.assign({}, ob, newOb))

/**
 * Collect values with the same key and return an object with a one-to-many key-value relationship.
 * @param {Array<Array<(string|symbol), *>>} keyVals - Ordered pairs of key-values to reduce over.
 * @returns {Object<(string|symbol), Array<*>>} Object mapping keys to arrays of values.
 */
const collect = keyVals => keyVals.reduce((acc, [k, v]) => {
  acc[k] ??= []
  acc[k].push(v)
  return acc
}, {})

/**
 * Like collect(), but eliminate duplicate values (based on set behavior).
 * @param {Array<Array<(string|symbol), *>>} keyVals - Ordered pairs of key-values to reduce over.
 * @returns {Object<(string|symbol), set<*>>} Object mapping keys to sets of unique values.
 */
const collectUnique = keyVals => keyVals.reduce((acc, [k, v]) => {
  acc[k] ??= new Set()
  acc[k].add(v)
  return acc
}, {})

// See docs for chooseN() below, with one exception:
// The first parameter here is a function to generate (random) numbers in [0, 1), parameterized for more control (e.g., testing)
/* Implementation notes: this is sort of a variation on the Fisher–Yates shuffle, using the end-indices of the array to fill in the gaps created by "removing" the randomly chosen indices. This keeps track of how many available choices are left, and which indices have not yet been chosen, without modifying the original array. Each round, after randomly selecting an index (and corresponding element) from the number of choices remaining, the function maps that chosen index to the current last-available index in order to have fewer remaining choices in the next round, but to still be able to select from a contiguous range of indices (by removing the last-available index instead of the chosen index, which now maps to that last-available index). If the same index gets selected in the future, it will therefore map to the index of an element that has not yet been chosen. */
const _chooseN = (random, n, array) => {
  const chosen = []
  const insteadOf = {}
  let choicesAvailable = array.length
  while (choicesAvailable && chosen.length < n) {
    const i = Math.floor(random() * choicesAvailable)
    chosen.push(array[insteadOf[i] ?? i])
    choicesAvailable-- // # of choices next round, & index of last choice this round
    if (i < choicesAvailable) { // i.e., if 'i' was not the index of the last choice
      // Map the chosen index to last available, or what last available itself maps to
      // As choicesAvailable shrinks, this is how choices in the tail remain choosable
      insteadOf[i] = insteadOf[choicesAvailable] ?? choicesAvailable
    }
  }
  return chosen
}

/**
 * Return N randomly chosen elements from an array.
 * @param {number} n - Number of elements to choose.
 * @param {Array} array - Array from which to choose elements.
 * @returns {Array} Array of chosen elements.
 */
const chooseN = partial(_chooseN, Math.random)

// See docs for logTime() below, with one exception:
// The first parameter here is an object with timer start/end functions, parameterized for more control (e.g., testing)
const _logTime = async (
  { time, timeEnd },
  times,
  fn,
  timerId = `${Date.now()}-${Math.random()}`
) => {
  time(timerId)
  for (let i = 1; i <= times; i++) { await fn() }
  timeEnd(timerId)
}

/**
 * Call a function a number of times and log the total duration to the console.
 * @async
 * @param {number} times - The number of times to call a given function (synchronously, with await); useful for amplifying differences in execution time between functions.
 * @param {function} fn - The function to call; may be synchronous or asynchronous.
 * @param {string} [timerId=`${Date.now()}-${Math.random()}`] An id/label for the timer; shows up in the log.
 * @returns {undefined} Function called for side-effect only.
 */
const logTime = partial(_logTime, console)

export { partial, partialOb, collect, collectUnique, _chooseN, chooseN, _logTime, logTime }
