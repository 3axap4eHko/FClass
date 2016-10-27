const lex = require('pug-lexer');
const pug =
`Loader(a='asdasd' aa='asda asdas')
  Initialization(b=null)
  Render(c=undefined)
  Handle(d={a:1})
`;

const pugResult = lex(pug, {filename: 'my-file.pug'});

const root = {
    name: '__root',
    args: {},
    children: []
};

const Loader = () => {};
const Initialization = () => {};
const Render = () => {};
const Handle = () => {};

const result = pugResult.reduce( (result, token) => {
    const {parent} = result;
    const {type, name, val} = token;
    switch (type) {
        case 'tag': {
            const service = {name: val, service: eval(val), args: {}, children: []};
            result.current = service;
            parent.children.push(service);
        } break;
        case 'attribute': {
            eval(`result.current.args[name] = ${val}`);
        } break;
        case 'indent': {
            result.parents.push(result.current);
            result.parent = result.current;
        } break;
        case 'outdent': {
            result.parents.pop();
            result.parent = result.parents[result.parents.length - 1];
        } break;
    }
    return result;
}, {parents: [root], parent: root, current: root});
console.log(result.parents[0].children);