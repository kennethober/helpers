# Helpers

A module of handy-dandy functions.

## Installation
```bash
npm install [TBD]
```

## Usage
```js
import { partial as p } from './path/to/node_modules/@kennethober/helpers/index.js'

const add = (x, y) => x + y
const add1 = p(add, 1)
```

Note: if using with Node, import either from an `.mjs` file, or from a package with `"type": "module"` in `package.json`.
