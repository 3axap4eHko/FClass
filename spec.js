const jsx = require('jsx-transform');
const createFClass = require('./fclass');
const {FClass} = createFClass;

class Loader extends FClass {

}
class Initialization extends FClass {

}
class Render extends FClass {

}
class Service extends FClass {

}
class UpdateAccounts extends FClass {

}
class UpdateAccount extends FClass {

}
class HandleResults extends FClass {

}

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