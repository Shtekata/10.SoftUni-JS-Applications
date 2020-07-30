export default function el(type, content, attributes) {
  const result = document.createElement(type);
  if (attributes !== undefined) {
    Object.assign(result, attributes);
  }
  if (Array.isArray(content)) {
    content.forEach(append);
  } else if (content !== null && content !== undefined) {
    append(content);
  }
  function append(node) {
    if (typeof node === 'string' || typeof node === 'number') {
      node = document.createTextNode(node);
    }
    result.appendChild(node);
  }
  return result;
}

export function p(content, attributes) {
  return el('p', content, attributes);
}

export function div(content, attributes) {
  return el('div', content, attributes);
}

export function contentDiv(content) {
  return div(content, { className: 'content' });
}

export function button(content, attributes) {
  const btn = el('button', content, attributes);
  btn.disable = () => {
    btn.disabled = true;
  }
  btn.enable = () => {
    btn.disabled = false;
  }
  return btn;
}


