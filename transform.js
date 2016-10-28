const jsx = require('jsx-transform');

const result = jsx.fromString(`
<html lang="en">
<head>
    <link rel="stylesheet" href="test.css" />
</head>
<body>
    <Header>{$this.test}</Header>
    <ToolBar>
        <ToolBarItem title="Home" idx={1} />
        <ToolBarItem title="About" />
    </ToolBar>
    <script src="test.js"></script>
</body>
</html>
`, {
    factory: 'Tag.create',
    passUnknownTagsToFactory: true,
    unknownTagsAsString: true
});


const _Name = Symbol('name');
const _Props = Symbol('props');
const _Children = Symbol('children');
const escExpr = /'/g;

function escape(value) {
    switch (typeof value) {
        case 'string':
            return `'${value.replace(escExpr, '\\\'')}'`;
        default:
            return value;
    }
}

function toArray(data = {}) {
    const pairs = Object.keys(data).map( key => `${escape(key)} => ${escape(data[key])}`);
    return `[${pairs.join(', ')}]`;
}

function toChildren(child, intend) {
    if (child instanceof Tag) {
        return child.toString(intend+2);
    }
    return child;
}

class Tag {
    static create(name, props = {}, children = []) {
        return new Tag(name, props || {}, children);
    }
    constructor(name, props = {}, children = []) {
        this[_Name] = name;
        this[_Props] = props;
        this[_Children] = children;
    }
    get name() {
        return this[_Name];
    }
    get props() {
        return this[_Props];
    }
    get children() {
        return this[_Children];
    }
    toString(intendSize = 0) {
        const props = toArray(this[_Props]);
        const intend = ' '.repeat(intendSize*2);
        const nextIntend = ' '.repeat(intendSize*2+2);
        const children = this[_Children].map( c => toChildren(c, intendSize + 2)).join(',\n');

        return `\n${intend}${this[_Name]}(\n${nextIntend}${props},\n${nextIntend}[${children}]\n${intend})`;
    }
}
const handler = {
    get(target, property, receiver) {
        return '$this.'+property;
    }
};
function render(result) {
    const $this = new Proxy({}, handler);
    return eval(result);
}
const p = new Proxy({}, handler);

const template = render.call(p, result).toString();
console.log(`<?php
${template}
`);