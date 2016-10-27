const jsx = require('jsx-transform');
const createFClass = require('./fclass');
const {FClass} = createFClass;

class Loader extends FClass {

}

const Initialization = () => {};
const Render = () => {};
const Service = () => {};
const UpdateAccounts = () => {};
const UpdateAccount = () => {};
const HandleResults = () => {};

const result = jsx.fromString(`
<Loader>
    <Initialization/>
    <Render />
    <Service>
        <UpdateAccounts>
            <UpdateAccount />
        </UpdateAccounts>
        <HandleResults />
    </Service>
</Loader>
`, {
    factory: 'createFClass',
    passUnknownTagsToFactory: true
});

console.log(result);
const data = eval(result);
console.log(data);