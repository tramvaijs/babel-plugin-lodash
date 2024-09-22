# @tinkoff/babel-plugin-lodash

This plugin transforms lodash imports to include into bundle only imported functions.

## Installation

```shell
npm install --save-dev @tinkoff/babel-plugin-lodash
```

```shell
yarn add --dev @tinkoff/babel-plugin-lodash
```

## Example

**In**

```js
import _ from "lodash";
import { add } from "lodash/fp";
import { slice } from "lodash-es";

const addOne = add(1);
_.map([1, 2, 3], addOne);
slice([1, 2, 3], 2);
```

**Out**

```js
import _add from "lodash/fp/add";
import _map from "lodash/map";
import _slice from "lodash-es/slice";

const addOne = _add(1);
_map([1, 2, 3], addOne);
_slice([1, 2, 3], 2);
```

## Usage

### With a configuration file (Recommended)

`.babelrc`

```json title="babel.config.json"
{
  "plugins": ["@tinkoff/babel-plugin-lodash"]
}
```

### Via CLI

```sh
$ babel --plugins @tinkoff/babel-plugin-lodash script.js
```

### Via Node.js API

```js
require("@babel/core").transformSync(code, {
  plugins: ["@tinkoff/babel-plugin-lodash"],
});
```

## Options

### `ensureModuleExists`

`boolean`, defaults to `false`.

When this option is enabled, plugin tries to resolve path to imported lodash module using `require.resolve()`. If the module can not be found, an error is thrown.
Usually such check is done out of box by bundler (e.g. webpack) or typescript. Enabling this option may lead to decreasing performance.

**In**

```js
import _ from "lodash";

_.slice([1, 2], 1);
_.unknownFunc();
```

**Out**

```js
import _slice from "lodash/slice"; // OK
import _unknownFunc from "lodash/unknownFunc"; // ERROR

_slice([1, 2], 1);
_unknownFunc();
```

## Limitations

- Supported lodash packages: `lodash`, `lodash/fp`, `lodash-es`
- You must use ES6 imports to load Lodash
- Babel < 7 & Node.js < 14 aren’t supported
- Chain sequences aren’t supported. See [this blog post](https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba) for alternatives.
- Modularized [method packages](https://www.npmjs.com/browse/keyword/lodash-modularized) aren’t supported
