class Controller {
  constructor(param1, param2) {
    const name = "dhruvdutt";
    let age = 21;
    this.name = "Dhruvdutt"
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
