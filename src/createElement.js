/*
    VDOM을 생성하는데 필요한 메타데이터 객체를 생성하여 리턴한다
*/
export default function createElement(tagName, attrs={}, children=[]) {
  let self = this;
  return {
    self,
    tagName,
    attrs,
    children,
    isRoot: false
  };
}
