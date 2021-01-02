import ZabVue from "../src/ZabVue.js";
import Header from "./header.js";

export default new ZabVue({
  name: "App",
  components: { Header },
  onMounted: function(){
    console.log("App is mounted")
  },
  render: function (createElement) {
    let header = this.components.Header;
    let children = [header];

    let App = createElement("div", {}, children);
    return App;
  },
});
