// This is a wrapper for flyd for easier use
const R = require('ramda');

const flyd = require('flyd');
const every = require('flyd/module/every');
const switchLatest = require('flyd/module/switchlatest');
const flatMap = require('flyd/module/flatmap');
const filter = R.curryN(2, require('flyd/module/filter'));
const sampleOn = require('flyd/module/sampleon');

const c = R.compose;


// TODO very ugly workaround since high order stream in flyd will "swallow" events in the same execution loop
// TODO trigger twice if merging innerSingle, not trigger if not
const innerSingle = flyd.stream(
    [flyd.stream(true)], self => setTimeout(() => self(true), 0.1));

const innerEvery = R.curryN(2, (sec, data) => c(
    flyd.map(() => data), flyd.merge(innerSingle), every
)(sec));

// debug utility, use it like log(console)
const log = out => flyd.map(R.tap(out.log.bind(out)));

const first = s => flyd.stream([s], self => {
    self(s());
    self.end(true);
});


const wrapper = {};
Object.assign(wrapper, flyd);
Object.assign(wrapper, {
    every, switchLatest, flatMap, filter, sampleOn,
    innerEvery, first, log,
    do: flyd.on,
});


module.exports = wrapper;
