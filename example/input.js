function controller(param1, param2) {
  const name = "dhruvdutt";
  let age = 21;
}

controller.prototype.name = "Dhruvdutt";

controller.prototype.contributeTo = function(param) {
  var foo = "webpack";
};

controller.staticMethod = function(param) {
  var bar = "webpack-cli";
};

Object.defineProperty(controller.prototype, "hello", {
  get: function() {
    return "world";
  },
  set: function(name) {
    console.log("Do anything with " + name);
  }
});

Object.defineProperty(controller.prototype, "lastname", {
  get: function() {
    return "Jadhav";
  }
});
