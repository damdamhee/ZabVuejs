import createElement from "./createElement.js";
import createData from "./createData.js";
import render from "./render.js";

export default class ZabVue {
  constructor(attributes) {
    this.name = attributes.name;

    //set lifecycle methods;
    this.onCreated = attributes.onCreated || (() => {});
    this.onMounted = attributes.onMounted || (() => {});
    this.onUpdated = attributes.onUpdated || (() => {});

    //apply reactive properties
    this.props = attributes.props;
    // this.components = attributes.components; //자식 VDOM 노드
    this.components = {};
    Object.keys(attributes.components).forEach(key => {
      this.components[key] = attributes.components[key].vRootElement;
    })
    
    this.data = createData.call(
      this,
      attributes.data ||
        (() => {
          return {};
        })
    );
    this.methods = attributes.methods;

    let createElementFunc = attributes.render;

    this.render = () => {
      //VNode를 리턴한다
      let bindedCreateElement = createElement.bind(this);
      this.vRootElement = createElementFunc.call(this, bindedCreateElement);
      this.vRootElement.isRoot = true;
      return this.vRootElement;
    };
    this.render();

    this.onCreated();

    //dependencyTable을 생성한 후, 만약 데이터에 변경이 발생한다면, 화면을 갱신해야 한다 (다시 마운트 호출)
  }
  update(newVRootNode) {
    let newRootElement = render.call(this, newVRootNode , false);
    this.rootElement.replaceWith(newRootElement);
  }
  /*
    마운트 : 이미 DOM 트리가 구성된 상태이다.
  */
  mount(targetElementId) {
    //targetElementId에 해당하는 DOM에 마운트
    let targetElementNode = document.getElementById(targetElementId);
    try {
      let newRootElement = render.call(this, this.vRootElement);
      targetElementNode.replaceWith(newRootElement);
    } catch (error) {
      console.log(error);
      console.log(`Cannot Find DOM with ID ${targetElementNode}`);
      return;
    }

    this.onMounted();
  }
}
