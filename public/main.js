import ZabVue from "../src/ZabVue.js";
import App from "./App.js";
new ZabVue({
  name: "Container",
  components: { App },
  render: function (createElement) {
    let app = this.components.App;
    return app;
  },
}).mount("app");
