/** @jsx vdom */

// VirtualDOM node creation
function vdom(type, props, ...children) {
  return { type, props: props || {} , children };
}

// DOM node creation from VirtualDom node
function createElement(node) {
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }
  const $el = document.createElement(node.type);
  setProps($el, node.props);
  addEventListeners($el, node.props);
  node.children
    .map(createElement)
    .forEach($el.appendChild.bind($el));
  return $el;
}

// updating VirtualDOM
function updateElement($parent, oldNode, newNode, index = 0){
  if(!oldNode){
    $parent.appendChild(
      createElement(newNode)
    );
  }
  else if(!newNode){
    $parent.removeChild(
      $parent.childNodes[index]
    );
  }
  else if(changed(newNode, oldNode)){
    $parent.replaceChild(
      createElement(newNode),
      $parent.childNodes[index]
    );
  }
  else if(newNode.type){
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;

    updateProps(
      $parent.childNodes[index],
      newNode.props,
      oldNode.props
    );

    for(let i = 0; i < newLength || i < oldLength; i++){
      updateElement(
        $parent.childNodes[index],
        oldNode.children[i],
        newNode.children[i],
        i
      )
    }
  }
}

// DOM Changed
function changed(node1, node2){
  return typeof node1 !== typeof node2 ||
         typeof node1 === 'string' && node1 !== node2 ||
         node1.type !== node2.type
}

// set a prop on DOM node
function setProp($target, name, value){
  if(isCustomProp(name)){
    return;
  } else if (name === 'className'){
    $target.setAttribute('class', value);
  } else if (typeof value === 'boolean'){
    setBooleanProp($target, name, value);
  } else {
    $target.setAttribute(name, value);
  }
}

// set prop for boolean value
function setBooleanProp($target, name, value){
  if(value){
    $target.setAttribute(name, value);
    $target[name] = true;
  } else {
    $target[name] = false;
  }
}

// set all props on a DOM node
function setProps($target, props){
  Object.keys(props)
    .forEach(name => {
      setProp($target, name, props[name])
    });
}

// custom PropertyChecking
function isCustomProp(name){
  return isEventProp(name);
}

// remove custom prop
function removeBooleanProp($target, name) {
  $target.removeAttribute(name);
  $target[name] = false;
}

// remove prop
function removeProp($target, name, value) {
  if (isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    $target.removeAttribute('class');
  } else if (typeof value === 'boolean') {
    removeBooleanProp($target, name);
  } else {
    $target.removeAttribute(name);
  }
}

// updating a prop
function updateProp($target, name, newVal, oldVal) {
  if (!newVal) {
    removeProp($target, name, oldVal);
  } else if (!oldVal || newVal !== oldVal) {
    setProp($target, name, newVal);
  }
}

// update all props
function updateProps($target, newProps, oldProps = {}) {
  const props = Object.assign({}, newProps, oldProps);
  Object.keys(props).forEach(name => {
    updateProp($target, name, newProps[name], oldProps[name]);
  });
}

// check event on props
function isEventProp(name) {
  return /^on/.test(name);
}

// extract the event name
function extractEventName(name) {
  return name.slice(2).toLowerCase();
}

// insert event on DOM
function addEventListeners($target, props) {
  Object.keys(props).forEach(name => {
    if (isEventProp(name)) {
      $target.addEventListener(
        extractEventName(name),
        props[name]
      );
    }
  });
}

// Render Element to the DOM
function renderDOM(vdom, $root){
  console.log(vdom);
  $root.appendChild(createElement(vdom));
}

const smallList = () => {
  return (
    <ul className="list-group">
      <li onClick={(e) => e.target.style = "background-color: green;"} style={"background-color: red;"}>item 1</li>
      <li id="test">item 2</li>
    </ul>
  );
}


const list = (
  <div>
    {smallList()}
  </div>
);

renderDOM(
  list,
  document.querySelector('.root')
);
