# curtain-down

Register functions to run when node exits with `npm install curtain-down`.

``` js
const curtain = require('curtain-down');

const applaud = console.log.bind(console, '👏 👏 👏');
const boo = console.log.bind(console, '🍅 🍅 🍅');

// Register functions to run when SIGTERM or SIGKILL are received:
curtain.on(applaud);  // every time;
curtain.once(boo);    // just once.

// You can also cancel…
curtain.off(boo);  // a particular function,
curtain.off();     // or all of them.
```
