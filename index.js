'use strict';

const events = require('events');
const debug = require('debug')('curtain-down');

const EVENT = 'curtain-down';

const getFunctionName = (fn) => fn.name || '(anonymous)';

class Curtain extends events.EventEmitter {
  constructor () {
    super();

    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => {
        debug(`Received ${signal}, calling listeners…`);
        this.emit(EVENT);
      });
    });
  }

  on (handler) {
    // Called via super.once().
    if (arguments.length === 2)
      handler = arguments[1];
    else
      debug(`Registering "ON" handler ${getFunctionName(handler)}`);

    super.on(EVENT, handler);
  }

  once (handler) {
    debug(`Registering "ONCE" handler ${getFunctionName(handler)}`);
    super.once(EVENT, handler);
  }

  off (handler) {
    if (arguments.length === 1)
      this.removeListener(handler);
    else
      this.removeAllListeners();
  }

  removeListener (handler) {
    // Called via super.removeAllListeners().
    if (arguments.length === 2)
      handler = arguments[1];
    else
      debug(`Removing listener ${getFunctionName(handler)}`);

    super.removeListener(EVENT, handler);
  }

  removeAllListeners () {
    debug('Removing all listeners');
    super.removeAllListeners(EVENT);
  }
}

function curtain (handler) {
  curtain.emitter.on(handler);
}

curtain.emitter = new Curtain();
curtain.on = curtain.emitter.on.bind(curtain.emitter);
curtain.once = curtain.emitter.once.bind(curtain.emitter);
curtain.off = curtain.emitter.off.bind(curtain.emitter);

module.exports = curtain;
