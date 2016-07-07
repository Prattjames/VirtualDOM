/** @jsx vdom */
import {createElement, updateElement, renderDOM, vdom} from './lib/virtualDOM';

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
