'use strict';

const FClass = require('./fclass');
const {App, sequencer} = FClass;
const delayedResult = value => () => new Promise(r => setTimeout(r, 1000, value));

const ServiceManager = FClass(({children}) => {
    return sequencer(children);
});

const LoadData = FClass((i) => {
    console.log('loading...');
});

const HandleData = FClass((i) => {
    console.log('handling...');
});

const Result = FClass((i) => {
    console.log('result');
});

const config = delayedResult({config: {updateInterval: 10}});

App({config})(
    ServiceManager()(
        LoadData()(),
        HandleData()(),
        Result()()
    )
);