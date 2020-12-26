/*
  Q - 데이터 값이 변경되면 updateScreen()이 항상 바로 호출되는 것이 맞을까?
    - Queue를 이용하여 변경이 발생하면 이들을 한번에 모아서 batch처리할 수 있도록 하면 좋을 것 같다
*/
export default function createData(dataFunc) {
  let updateScreen = () => {
    let newVRootElement = this.render();
    this.update(newVRootElement);
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
