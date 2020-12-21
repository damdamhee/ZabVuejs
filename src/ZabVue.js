import createElement from "./createElement.js";
import createData from "./createData.js";
import render from "./render.js";

export default class ZabVue {
  constructor(attributes) {
    //apply reactive properties
    this.props = attributes.props;
    this.components = attributes.components; //자식 VDOM 노드
    this.data = createData.call(this, attributes.data);
    this.methods = attributes.methods;

    let createElementFunc = attributes.render;

    this.render = () => {
      let elem = createElementFunc.call(this, createElement);
      this.rootNode = render.call(this, elem);
      return this.rootNode;
    };
    this.rootNode = this.render();

    //dependencyTable을 생성한 후, 만약 데이터에 변경이 발생한다면, 화면을 갱신해야 한다 (다시 마운트 호출)
  }
  mount(targetElementId) {
    //targetElementId에 해당하는 DOM에 마운트
    let targetElementNode = document.getElementById(targetElementId);
    try {
      if (targetElementNode.hasChildNodes())
        targetElementNode.removeChild(targetElementNode.firstChild);
      targetElementNode.appendChild(this.rootNode);
    } catch (error) {
      console.log(`Cannot Find DOM with ID ${targetElementNode}`);
      return;
    }
  }
}
