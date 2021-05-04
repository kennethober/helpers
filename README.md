# Helpers

A module of handy-dandy functions.

## Installation
```bash
npm install @kennethober/helpers
```

## Usage
```js
// Browser
import * as H from './path/to/node_modules/@kennethober/helpers/index.js'
import { partial as p } from './path/to/node_modules/@kennethober/helpers/index.js'

// Node.js
import * as H from '@kennethober/helpers'
import { partial as p } from '@kennethober/helpers'

const add = (x, y) => x + y
const add1 = H.partial(add, 1)
const add2 = p(add, 2)
```

Note: if using with Node.js, import either from an `.mjs` file, or from a package with `"type": "module"` in `package.json`.

## Exported functions

**partial**  
(Function, any, ...) => Function  
Partially applies a function

**unique**  
Array => Array  
Returns an Array with no duplicates, following the behavior of Sets.

**collect**  
[[k1, v1], [k1, v1], [k1, v2], ...] => { k1: [v1, v1, v2, ...], ... }  
Returns an Object with a one(key)-to-many(values) relationship

**collectUnique**  
[[k1, v1], [k1, v1], [k1, v2], ...] => { k1: [v1, v2, ...], ... }  
Like collect(), but passes the Array-values through unique()
