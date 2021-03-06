/** @jsx vd */

function vd(type, props, ...children){
  return {type, props, children};
};

function createElement(node){
  if(typeof node === 'string'){
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);
  node.children
    .map(createElement)
    .forEach($el.appendChild.bind($el));
  return $el;
}

const a = (
  <ul class="list">
    <li style="background-color: red;">item 1</li>
    <li>item 2</li>
  </ul>
);
