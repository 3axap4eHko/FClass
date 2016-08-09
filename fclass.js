'use strict';

function promisify(callback, args = []) {
    if (callback instanceof Promise) return callback;
    if (typeof callback !== 'function') return Promise.resolve(callback);

    return new Promise( resolve => resolve(callback(...args)) );
}

function sequencer(actions, results = []) {
    if (actions.length) {
        const action = actions.shift();
        return promisify(action)
            .then( result => sequencer(actions, results.concat([result])) )
            .catch( err => console.error(err) );
    } else {
        return Promise.resolve(results);
    }
}

function composer(actions) {
    return Promise.all(actions.map( promisify ));
}

function resolveFArgs(fArgs) {
    const fArgsArray = Object.keys(fArgs).map( key => fArgs[key] );
    return sequencer(fArgsArray);
}

const global = {};

function FClass (executor) {

    return (fArgs = {}) => {
        return (...children) => {

            const state = {};

            return resolveFArgs(fArgs)
                .then( args => executor(Object.assign({}, ...args, { state }, global) ) )
                .then( args => {
                    Object.assign(global, args || {});
                    return sequencer(children);
                } );
        }
    };
}

FClass.sequencer = sequencer;
FClass.composer = composer;

module.exports = FClass;