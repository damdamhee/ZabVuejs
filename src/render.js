/*
    인자로 전달받은 element 정보를 이용하여 'DOM 객체(Node)'를 생성 및 리턴한다
*/
export default function render(element) {
  //DOM 객체 생성
  let elementNode = null;
  try {
    elementNode = document.createElement(element.tagName);
  } catch (error) {
    elementNode = document.createTextNode(element.tagName);
    return elementNode;
  }

  //Attribute 설정
  if (!(elementNode.constructor === Text)) {
    for (const [k, v] of Object.entries(element.attrs)) {
      elementNode.setAttribute(k, v);
    }
  }

  //Set Children
  if (element.children.length != 0) {
    for (const childElement of element.children) {
      let childElementNode = render(childElement);
      elementNode.appendChild(childElementNode);
    }
  }

  /*
    하나의 컴포넌트는 여러 n-depth element로 구성될 수 있고,
    이때의 root는 오직 최상위 element이어야만 한다.
    render()는 mount 단계뿐만 아니라 update 단계에서도 호출되므로
    !element.self.rootElement 검증이 필요하다
  */
  if (element.isRoot && !element.self.rootElement) {
    element.self.rootElement = elementNode;
  }

  return elementNode;
}
