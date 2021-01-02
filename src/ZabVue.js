import createElement from "./createElement.js";
import { createData, createComputed, createWatch } from "./createReactivity.js";
import render from "./render.js";

export default class ZabVue {
  constructor(attributes) {
    this.name = attributes.name;

    //set lifecycle methods;
    this.onCreated = attributes.onCreated || (() => {});
    this.onMounted = attributes.onMounted || (() => {});
    this.onBeforeUpdate = attributes.onBeforeUpdate || (() => {})
    this.onUpdated = attributes.onUpdated || (() => {});

    //apply reactive properties
    this.props = attributes.props;
    // this.components = attributes.components; //자식 VDOM 노드
    this.components = {};
    Object.keys(attributes.components).forEach(key => {
      this.components[key] = attributes.components[key].vRootElement;
    })
    
    //data
    let data = createData.call(
      this,
      attributes.data ||
        (() => {
          return {};
        })
    );
    Object.keys(data).forEach(key => {
      this[key] = data[key];
    })

    let methods = attributes.methods;
    Object.keys(methods).forEach(key => {
      //data, watch, computed와 겹치는게 없는지 확인하는 로직 필요
      this[key] = methods[key];
    })
    this.methods = attributes.methods;

    //computed
    let computed = createComputed.call(this, attributes.computed || {});
    Object.keys(computed).forEach(key => {
      //todo - data, watch와 동일한 이름을 갖는 경우 Exception을 발생시키도록 할 필요가 있다
      this[key] = computed[key];
    })

    this.watch = createWatch.call(this, attributes.watch || {});

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
    this.onBeforeUpdate();
    let newRootElement = render.call(this, newVRootNode , false);

    //this.rootElement는 초기에 mount과정에서 호출되는 render()에서 설정되는 값이다
    this.rootElement.replaceWith(newRootElement);
    this.onUpdated();
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
    console.log(this)
  }
}
