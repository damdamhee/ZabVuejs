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

  return elementNode;
}
