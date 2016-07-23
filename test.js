/* eslint-disable no-console */
'use strict';

const assert = require('assert');
const cluster = require('cluster');
const curtain = require('./index');

return cluster.isMaster
  ? master()
  : worker();

function master () {
  const worker = cluster.fork();

  worker.on('exit', (code, signal) => {
    assert.equal(code, 0, 'Clean exit with code 0');
  });

  worker.kill();
}

function worker () {
  // Prevent exit.
  const intervalId = setInterval(function () {}, 1000);
  const calledVia = {
    '()': false,
    '.on()': false,
    '.once()': false
  };

  process.on('exit', function () {
    Object.keys(calledVia).forEach(key => {
      assert(calledVia[key], `Called via ${key}`);
    });
  });

  function iShouldNeverRun () {
    throw new Error('Oops!');
  }

  curtain(iShouldNeverRun);
  curtain.off(); // remove all

  curtain(function () {
    calledVia['()'] = true;
    console.log('via ()');
  });

  curtain.on(function viaOn () {
    calledVia['.on()'] = true;
    console.log('via .on()');
  });

  curtain.once(function viaOnce () {
    calledVia['.once()'] = true;
    console.log('via .once()');
  });

  curtain.on(iShouldNeverRun);
  curtain.once(iShouldNeverRun);
  curtain.off(iShouldNeverRun); // remove specific
  curtain.off(iShouldNeverRun); // remove specific

  curtain.once(clearInterval.bind(null, intervalId));
}
