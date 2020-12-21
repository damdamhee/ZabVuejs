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
    this.components = attributes.components; //자식 VDOM 노드
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
      this.rootElement = createElementFunc.call(this, createElement);
      this.rootNode = render.call(this, this.rootElement);
      return this.rootNode;
    };

    //ZabVue 객체 생성 시에는 단순히 VDOM 객체만 생성한 상태이다
    this.rootElement = createElementFunc.call(this, createElement);

    this.onCreated();
    //dependencyTable을 생성한 후, 만약 데이터에 변경이 발생한다면, 화면을 갱신해야 한다 (다시 마운트 호출)
  }
  mount(targetElementId) {
    //targetElementId에 해당하는 DOM에 마운트
    let targetElementNode = document.getElementById(targetElementId);
    try {
      this.render();
      targetElementNode.replaceWith(this.rootNode);
    } catch (error) {
      console.log(`Cannot Find DOM with ID ${targetElementNode}`);
      return;
    }

    this.onMounted();
  }
}
