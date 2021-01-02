import ZabVue from "../../src/ZabVue.js";
export default new ZabVue({
  name: "Header",
  onCreated: function () {
    console.log("onCreated()");
    setTimeout(() => {
      this.message.value = "GOOD BYE WORLD";
    }, 2500);
  },
  onMounted: function () {
    console.log("onMounted()");
  },
  onUpdated: function () {
    console.log("onUpdated()");
  },
  components: {},
  data: function () {
    return {
      message: "HELLO WORLD",
    };
  },
  computed: {
   computedMessage : function(){
     let message =  `computed message : ${this.message.value}`;
     return message
   }
  },
  watch: {
    message: function(newValue, prevValue){
      console.log(`prevValue : ${prevValue}`)
      console.log(`newValue : ${newValue}`)
    }
  },
  render: function (createElement) {
    let message = createElement(this.message.value);
    let computedMessage = createElement(this.computedMessage.value);

    let childMessage = createElement('h1', {}, [message])
    let childComputedMessage = createElement('h3',{},[computedMessage])
    let children = [childMessage, childComputedMessage];

    let h1Element = createElement("h1", {}, children);
    return h1Element;
  },
});
