import tap from 'tap'
import * as H from '../index.js'

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

const orderedPairs = () => [['a', 1], ['b', 2], ['a', 2], ['a', 1], ['b', 3]] // <- Has dups

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

tap.test('logTime()', async t => {
  let callCount = 0
  const fn = () => { callCount++ }

  let timeCalled = false
  console.time = () => { timeCalled = true }

  let timeEndCalled = false
  console.timeEnd = () => { timeEndCalled = true }

  await H.logTime(5, fn)
  t.equal(callCount, 5, 'calls a function the given number of times')
  t.ok(timeCalled, 'calls console.time()')
  t.ok(timeEndCalled, 'calls console.timeEnd()')
  t.end()
})
