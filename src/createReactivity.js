/*
  Q - 데이터 값이 변경되면 updateScreen()이 항상 바로 호출되는 것이 맞을까?
    - Queue를 이용하여 변경이 발생하면 이들을 한번에 모아서 batch처리할 수 있도록 하면 좋을 것 같다
*/
let targetFunction = null;
class Dependency {
  constructor(defaults){
    this.defaults = defaults;
    this.subscribers = []
  }
  depend(){
    //targetFunction은 createComputed, createWatch 모듈에 정의된 변수이다
    if(targetFunction && !this.subscribers.includes(targetFunction)){
      this.subscribers.push(targetFunction);
    }
  }
  notify(){
    this.subscribers.forEach(targetFunction => {
      targetFunction();
    })
    this.defaults.forEach(defaultFunction => {
      defaultFunction();
    })
  }
}
export function createData(dataFunc) {
  let updateScreen = () => {
    let newVRootElement = this.render();
    this.update(newVRootElement);
  };

  let data = {};
  for (const [k, v] of Object.entries(dataFunc())) {
    let dependency = new Dependency([updateScreen]);
    let refObj = {
      value: v,
    };

    let handler = {
      get: function (target, _) {
        dependency.depend();
        return target["value"];
      },
      set: function (obj, _, value) {
        obj["value"] = value;
        dependency.notify();
        return true;
      },
    };
    let proxyRefObj = new Proxy(refObj, handler);
    data[k] = proxyRefObj;
  }

  return data;
}
export function createComputed(computed){
  /*
    1. computed 객체 내에 정의된 각각의 속성에 대해서
    2. 함수를 한 번 씩 호출한다
  */
  let bindedComputed = {};
  Object.keys(computed).forEach(key => {
    let computedFunction = computed[key];
    let bindedComputedFunction = computedFunction.bind(this);
    targetFunction = bindedComputedFunction;
    targetFunction();
    targetFunction = null;
    bindedComputed[key] = bindedComputedFunction;
  })
  return bindedComputed;
}