## nano-persistent-memoizer

Memoizes a `String -> String` or `String -> Promise String` function persistently. It uses `window.localStorage` on the browser and the filesystem (`~/.nano-persistent-memoizer`) on Node. <1K compressed.

## Usage

```javascript
var memo = require("nano-persistent-memoizer");

var twice = memo("twice").async(str => {
  for (var i = 0; i < 10000000; ++i) {
    Math.sin(i);
  }
  return Promise.resolve(str + str);
});

(async () => {
  console.log(await twice("foo")); // slow
  console.log(await twice("bar")); // slow
  console.log(await twice("foo")); // instant (cached)
  console.log(await twice("bar")); // instant (cached)
  twice.clear(); // clears cache
})();
```
