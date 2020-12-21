/*
    data객체 안에 있는 각각의 속성값에 변경이 발생하면, 어떻게 처리해야 할까?
    -1) computed 내 메소드에서 사용하는 경우
        -1.1) computed 메소드 수행
        -1.2) 화면 갱신
    -2) 그냥 UI에서만 사용하는 경우
        -2.1) 화면 갱신
    -> 어쨋거나 무조건 화면을 갱신하기는 해야 한다
*/
export default function createData(dataFunc) {
  let updateScreen = () => {
    let root = this.rootNode.parentNode;
    root.removeChild(root.firstChild);

    let elem = this.render();
    root.appendChild(elem);

    this.onUpdated();
  };

  let data = {};
  for (const [k, v] of Object.entries(dataFunc())) {
    let refObj = {
      value: v,
    };

    let handler = {
      get: function (target, _) {
        // console.log(`get ${target["value"]}`);
        return target["value"];
      },
      set: function (obj, _, value) {
        obj["value"] = value;
        updateScreen();
        return true;
      },
    };
    let proxyRefObj = new Proxy(refObj, handler);
    data[k] = proxyRefObj;
  }

  return data;
}
