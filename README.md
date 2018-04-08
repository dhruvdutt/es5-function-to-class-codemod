# Transform ES5 Functions to ES6 Classes :package: 

### [Live Demo](https://astexplorer.net/#/gist/855cc00b6ebfe60f53b2c0543482ee92/) 💻

#### Features :100:
- [x] Methods on `prototype`
- [x] Static Methods on `prototype`
- [x] Variables and Literals on `prototype`
- [x] Getters, Setters with `defineProperty`
- [x] Block-level Variables

##### Similar project - [lebab](https://uniibu.github.io/lebab-ce/). It doesn't currently support:
  - [ ] Static Methods on `prototype`
  - [ ] Block-level Variables

#### Setup and Run :runner:

```bash
npm i -g jscodeshift
git clone --depth=1 https://github.com/dhruvdutt/es5-function-to-class-codemod codemod && cd codemod
jscodeshift -t func-to-class.js example/input.js
```

#### Sample Input 🛴 and Output :rocket:
![input2](https://user-images.githubusercontent.com/5961873/38467870-ae616014-3b5b-11e8-8b92-87bdde827546.png)

[Complex example](https://astexplorer.net/#/gist/541ba10e75228eeb83ccf95589b0bd76): Multiple functions in same file with one of the functions having same name.
 
Also, featured on [awesome-jscodeshift](https://github.com/sejoker/awesome-jscodeshift#codemods).
