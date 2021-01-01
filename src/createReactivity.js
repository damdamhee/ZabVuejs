/*
  Q - 데이터 값이 변경되면 updateScreen()이 항상 바로 호출되는 것이 맞을까?
    - Queue를 이용하여 변경이 발생하면 이들을 한번에 모아서 batch처리할 수 있도록 하면 좋을 것 같다
*/
let targetFunction = null;
class Dependency {
  constructor(defaults){
    this.defaults = defaults;
    this.subscribers = []
    //for watch parameters
    this.prevValue = undefined;
    this.newValue = undefined;
  }
  depend(){
    //targetFunction은 createComputed, createWatch 모듈에 정의된 변수이다
    if(targetFunction && !this.subscribers.includes(targetFunction)){
      this.subscribers.push(targetFunction);
    }
  }
  notify(){
    this.subscribers.forEach(targetFunction => {
      targetFunction(this.newValue, this.prevValue);
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
        dependency.prevValue = obj["value"];
        obj["value"] = value;
        dependency.newValue = value; 
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

export function createWatch(watch){
  /*
    1. 어떤 데이터 값에 변화가 발생한다
    2. watch 함수가 호출된다
    - computed와는 달리 특정 data변수 하나만 주시한다
    - watch함수는 data변수와 동일한 이름을 갖는다
  */
 
  let bindedWatch = {};
  Object.keys(watch).forEach(key => {
    let watchFunction = watch[key];
    let bindedWatchFunction = watchFunction.bind(this);
    targetFunction = bindedWatchFunction;
    this.data[key].value; //데이터 getter가 호출되면서 subscriber에 watch함수가 추가된다
    targetFunction = null;
    bindedWatch[key] = bindedWatchFunction;
  })
  return bindedWatch;
}