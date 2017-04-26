require('node-jsx').install({ extension: '.js', harmony: true });

const Person = require('./Person');

const VALID_PROPS = {
  className: true,
};

function transform(comp) {
  if (typeof comp === 'string' || !comp) {
    return comp || '';
  }

  if (comp instanceof Array) {
    comp = comp[0];
  }

  // console.log(' >>> tranform');
  // console.log(JSON.stringify(comp, null, 2));
  const props = [];
  Object.keys(comp.props).forEach((prop) => {
    if (prop in VALID_PROPS) {
      props.push(`${prop}="${comp.props[prop]}"`);
    }
  });

  // if (comp.key) {
  //   props.push(`key="${comp.key}"`);
  // }

  let str = comp.type === 'twig' ? '{% ' : `<${comp.type}${props.length > 0 ? ` ${props.join(' ')}` : ''}>`;

  if (typeof comp.props.children === 'string') {
    str += `${comp.props.children}`;
  } else if (comp.props.children instanceof Array) {
    for (let i = 0; i < comp.props.children.length; i++) {
      // console.log(' >>> tranform::props');
      // console.log(JSON.stringify(comp.props, null, 2));
      str += transform(comp.props.children[i]);
    }
  }

  return str + (comp.type === 'twig' ? ' %}' : `</${comp.type}>`);
}

const props = {
  twig: true,
  name: '{{ name }}',
  age: '{{ age }}',
  faves: [
    { key: '{{ fave.color }}', value: '{{ fave.red }}' },
  ],
};

// console.log(JSON.stringify(Person(props), null, 2));
const tree = transform(Person(props));
console.log(JSON.stringify(tree, null, 2));
