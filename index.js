const partial = (fn, ...argsNow) => (...argsLater) => fn(...argsNow, ...argsLater)

export { partial }
