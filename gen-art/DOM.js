function el(type, props, children) {
  var element = document.createElement(type);

  Object.keys(props || {}).map((key) => {
    if (props[key] instanceof Object && key === 'style') {
      Object.keys(props[key] || {}).map((value) => {
        element.style[value] = props[key][value];
      });
    } else {
      element.setAttribute(key, props[key]);
    }
  });

  if (typeof children === 'number' || typeof children === 'string') {
    element.textContent = children;
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  if (children instanceof Array) {
    children.forEach((child) => {
      if (typeof child === 'number' || typeof children === 'string') {
        element.textContent = child;
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  }

  return element;
}
