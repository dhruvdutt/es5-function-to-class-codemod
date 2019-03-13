function Controller(param1, param2) {
    const name = "dhruvdutt";
    let age = 21;
  }

  Controller.prototype.name = "Dhruvdutt";

  Controller.prototype.contributeTo = function(param) {
    var foo = "webpack";
  };

  Controller.staticMethod = function(param) {
    var bar = "webpack-cli";
  };

  Object.defineProperty(Controller.prototype, "hello", {
    get: function() {
      return "world";
    },
    set: function(name) {
      console.log("Do anything with " + name);
    }
  });

  Object.defineProperty(Controller.prototype, "lastname", {
    get: function() {
      return "Jadhav";
    }
  });
