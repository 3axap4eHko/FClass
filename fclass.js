'use strict';

function promisify(callback, args = []) {
    if (callback instanceof Promise) return callback;
    if (typeof callback !== 'function') return Promise.resolve(callback);

    return new Promise(resolve => resolve(callback(...args)));
}

function sequencer(actions, results = []) {
    if (actions.length) {
        const action = actions.shift();
        return promisify(action)
            .then(result => sequencer(actions, results.concat([result])))
            .catch(err => console.error(err));
    } else {
        return Promise.resolve(results);
    }
}

function composer(actions) {
    return Promise.all(actions.map(promisify));
}

function resolveFArgs(fArgs) {
    const fArgsArray = Object.keys(fArgs).map(key => fArgs[key]);
    return sequencer(fArgsArray)
        .catch(err => console.error(err));
}

function FClass(executor) {

    return (fArgs = {}) => {

        return (...children) => {

            const state = {};

            return () => resolveFArgs(fArgs)
                .then(args => executor(Object.assign({}, ...args, {children, state})))
                .catch(err => console.error(err));
        }
    };
}

function App(initFArgs) {
    return (...children) => {
        return resolveFArgs(initFArgs)
            .then(init => sequencer(children));
    };
}

FClass.App = App;

FClass.sequencer = sequencer;
FClass.composer = composer;

module.exports = FClass;