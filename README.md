# Transform ES5 Functions to ES6 Classes :package: 

#### Features :100:
- [x] Methods on `prototype`
- [x] Static Methods on `prototype`
- [x] Variables and Literals on `prototype`
- [x] Getters, Setters with `defineProperty`
- [x] Block-level Variables

#### Setup and Run :runner:

```bash
npm i -g jscodeshift
git clone --depth=1 https://github.com/dhruvdutt/es5-function-to-class-codemod codemod && cd codemod
jscodeshift -t func-to-class.js example/input.js
```

#### Sample Input 🛴

```js
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
    get: function () {
        return "world";
    },
    set: function (name) {
        console.log("Do anything with " + name);
    },
});

Object.defineProperty(Controller.prototype, "lastname", {
    get: function () {
        return "Jadhav";
    },
});
```

#### Sample Output :rocket:

```js
class Controller {
  constructor(param1, param2) {
    const name = "dhruvdutt";
    let age = 21;
    this.name = "Dhruvdutt";
  }

  contributeTo(param) {
    var foo = "webpack";
  }

  static staticMethod(param) {
    var bar = "webpack-cli";
  }

  get hello() {
    return "world";
  }

  set hello(name) {
    console.log("Do anything with " + name);
  }

  get lastname() {
    return "Jadhav";
  }
}
```
