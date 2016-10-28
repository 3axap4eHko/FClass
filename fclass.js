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

function resolveFArgs(args) {
    const argsArray = Object.keys(args).map(key => args[key]);
    return sequencer(argsArray)
        .catch(err => console.error(err));
}

const _Args = Symbol('args');
const _Children = Symbol('children');

class FClass {
    constructor(args, children) {
        this[_Args] = args;
        this[_Children] = children;
    }
}

function createFClass(Class, args, children) {
    const instance = new Class(args, children);
    if (instance instanceof FClass) {

        return instance;
    }
    throw new Error('Class in not instance of FClass');
}

function App(initArgs, root) {
    return (...children) => {
        return resolveFArgs(initArgs)
            .then(init => sequencer(children));
    };
}

createFClass.App = App;
createFClass.FClass = FClass;

createFClass.sequencer = sequencer;
createFClass.composer = composer;

module.exports = createFClass;