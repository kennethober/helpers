import tap from 'tap'
import * as H from '../helpers.js'

tap.test('partial()', t => {
  const fn = (...args) => [...args]
  const applied = H.partial(fn, 1, 2)
  const noArg = () => 2
  t.type(applied, 'function', 'returns a function')
  t.strictSame(applied(), [1, 2], 'applies multiple arguments')
  t.strictSame(applied(3, 4), [1, 2, 3, 4], 'returned fn applies given and new arguments in order')
  t.strictSame(H.partial(applied, 3, 4)(5), [1, 2, 3, 4, 5], 'can apply more than once')
  t.strictSame(H.partial(fn)(1, 2, 3), [1, 2, 3], 'applying no args is fine (...if useless)')
  t.equal(H.partial(noArg)(), 2, 'using a no-arg function is fine (...if useless)')
  t.equal(H.partial(noArg, 1, 2)(), 2, 'applying too many args is fine (...if useless)')
  t.end()
})

tap.test('partialOb()', t => {
  const fn = ob => ob
  const applied = H.partialOb(fn, { k1: 1, k2: 2 })
  const noArg = () => 2
  const argKey = ({ arg }) => arg
  t.type(applied, 'function', 'returns a function')
  t.strictSame(applied(), { k1: 1, k2: 2 }, 'applies multiple options-object parameters')
  t.strictSame(applied({ k3: 3, k4: 4 }), { k1: 1, k2: 2, k3: 3, k4: 4 }, 'returned fn accepts new options-object parameters')
  t.strictSame(
    H.partialOb(applied, { k3: 3, k4: 4 })({ k5: 5 }),
    { k1: 1, k2: 2, k3: 3, k4: 4, k5: 5 },
    'can apply more than once'
  )
  t.strictSame(H.partialOb(fn)({ k1: 1, k2: 2, k3: 3 }), { k1: 1, k2: 2, k3: 3 }, 'applying no object argument is fine (...if useless)')
  t.equal(H.partialOb(noArg)(), 2, 'using a no-arg function is fine (...if useless)')
  t.strictSame(applied({ k2: 3 }), { k1: 1, k2: 3 }, 'calling will overwrite old keys with new keys')
  t.strictSame(H.partialOb(applied, { k2: 3 })(), { k1: 1, k2: 3 }, 'applying will overwrite old keys with new keys')
  t.equal(H.partialOb(argKey, { arg: 1, notArg: 2 })(), 1, 'applying unused keys is fine (...if useless)')
  t.strictSame(H.partialOb(fn, { k1: 1 }, { k2: 2 })(), { k1: 1 }, 'extra passed objects are ignored')
  t.end()
})

// Sample data for collect() and collectUnique(); contains duplicates
const orderedPairs = () => [['a', 1], ['b', 2], ['a', 2], ['a', 1], ['b', 3]]

tap.test('collect() maps ordered pairs to keys and arrays of values', t => {
  t.strictSame(H.collect(orderedPairs()), { a: [1, 2, 1], b: [2, 3] })
  t.end()
})

tap.test('collectUnique() maps ordered pairs to keys and sets of unique values', t => {
  t.strictSame(H.collectUnique(orderedPairs()), {
    a: new Set([1, 2]),
    b: new Set([2, 3])
  })
  t.end()
})

tap.test('chooseN()', t => {
  let i = 0
  const countOutputs = [2 / 10, 3 / 9, 4 / 8, 5 / 7]
  const count = () => countOutputs[i++]
  const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const zero = () => 0
  const chosen = H._chooseN(count, 4, array)

  t.strictSame(array, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 'array argument is unchanged')
  t.equal(chosen.length, 4, 'result has the right number of elements')
  t.strictSame(chosen, [2, 3, 4, 5], 'result contains elements based on output of "random" fn')
  t.strictSame(H._chooseN(zero, 5, array), [0, 9, 8, 7, 6], 'result has no duplicates, even if the "random" function returns duplicate values')
  // Using partially applied chooseN below (with Math.random())
  t.strictSame(H.chooseN(0, array), [], 'can choose nothing')
  t.strictSame(new Set(H.chooseN(array.length, array)), new Set(array), 'can choose everything')
  t.end()
})

tap.test('logTime() ', async t => {
  const timerId = 'myTimerId'
  let callCount = 0
  const fn = () => { callCount++ }
  let timeArg = null
  const time = arg => { timeArg = arg }
  let timeEndArg = null
  const timeEnd = arg => { timeEndArg = arg }
  await H._logTime({ time, timeEnd }, 5, fn, timerId)

  t.equal(callCount, 5, 'function is called the given number of times')
  t.equal(timeArg, timerId, 'time is called, and passed the timerId')
  t.equal(timeEndArg, timerId, 'timeEnd is called, and passed the timerId')
  t.end()
})
