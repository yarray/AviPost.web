// This is a wrapper for flyd for easier use

const flyd = require('flyd');
const every = require('flyd/module/every');
const switchLatest = require('flyd/module/switchlatest');
const flatMap = require('flyd/module/flatmap');
const filter = require('flyd/module/filter');

const R = require('ramda');
const c = R.compose;


// TODO very ugly workaround since high order stream in flyd will "swallow" events in the same execution loop
const innerSingle = flyd.stream(
    [flyd.stream(true)], self => setTimeout(() => self(true), 0.1));

const innerEvery = R.curryN(2, (sec, data) => c(
    flyd.map(() => data), flyd.merge(innerSingle), every
)(sec));

const emit = R.curryN(3, (stream, type, e) => stream({ type, e }));
const extract = R.curryN(2, (type, stream) => filter(event => event.type === type, stream));

const wrapper = {};
Object.assign(wrapper, flyd);
Object.assign(wrapper, {
    every, switchLatest, flatMap, filter,
    innerEvery, emit, extract });


module.exports = wrapper;
