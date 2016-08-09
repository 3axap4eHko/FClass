FClass
======

``` javascript
'use strict';

const {createStore, applyMiddleware} = require('redux');
const thunkMiddleware = require('redux-thunk').default;
const FClass = require('./fclass');
const reducers = require('./reducers');


const Provider = FClass( ({store}) => {
    return {store};
});

const Loader = FClass(({response}) => {
    return {response};
});

const Service = FClass((instance) => {
    console.log(instance)
});

const Handler = FClass(() => {

});

const requestAction = () => new Promise(resolve => setTimeout(resolve, 1000, {response: 1024}));
const storeCreateAction = () => ({store: createStore(reducers, undefined, applyMiddleware(thunkMiddleware))});


Provider({storeCreateAction})(
    Loader({requestAction})(
        Service(),
        Handler()
    )
);
```