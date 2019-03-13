
// astExplorer.net Link :  https://astexplorer.net/#/gist/bcd1d38ee27499e69cff92b8b0801c38/latest

// Github Gist : https://gist.github.com/bcd1d38ee27499e69cff92b8b0801c38/8af09bdf83fb3e7bb869cd23e2002058e1a91160




/*



PLEASE NOTE :
THIS PACKAGE WONT WORK PROPERLY OF THERE ARE MORE THAN
ONE FUNCTION DEFINED





*/










var globalClassName;
var globalConstructor;
var globalConstructorParams;
var globalSuffixToAddInProgramBody;
module.exports =  (babel) => {
    const {
        types: t
    } = babel;

    return {
        name: "es5-function-to-es6-class", // not required
        visitor: {
            Program(path) {
                path.node.body.forEach(pat => {
                    var p = traverseThroughBodyAndReturnPrefixToBeAdded(pat, t);

                    if (!p) {
                        return;
                    }
                    globalSuffixToAddInProgramBody = p;
                });
                path.node.body.push(globalSuffixToAddInProgramBody);

            },



            ExpressionStatement(path) {

                const isPrototypesMethodExpressionDeclaration = isLookaLike(path.node, {
                    type: "ExpressionStatement",
                    expression: {
                        type: "AssignmentExpression",
                        left: {
                            type: "MemberExpression",
                            object: {
                                type: "MemberExpression",
                                object: {
                                    type: "Identifier",
                                    name: globalClassName
                                },
                                property: {
                                    type: "Identifier",
                                    name: "prototype"
                                }
                            }
                        },
                        right: {
                            type: "FunctionExpression"
                        },


                    }
                });

                if (isPrototypesMethodExpressionDeclaration) {

                    path.parent.body.forEach(b => {

                        if (typeof b.body !== "undefined") {

                            if (b.body.type == "ClassBody") {

                                // Push the method here
                                b.body.body.push(
                                    t.classMethod(
                                        "method",
                                        t.identifier(path.node.expression.left.property.name),
                                        path.node.expression.right.params,
                                        path.node.expression.right.body
                                    )
                                );

                            }



                        }
                    });
                    //    path.remove();


                } else {
                    const isStaticMethodExpressionDeclaration = isLookaLike(path.node, {
                        type: "ExpressionStatement",
                        expression: {
                            type: "AssignmentExpression",
                            left: {

                                type: "MemberExpression",
                                object: {
                                    type: "Identifier",
                                    name: globalClassName
                                },
                                property: {
                                    type: "Identifier",
                                    name: "staticMethod"
                                }
                            },
                            right: {
                                type: "FunctionExpression"
                            },


                        }

                    });

                    if (isStaticMethodExpressionDeclaration) {
                        // Push this expression to the classbody again


                        path.parent.body.forEach(b => {

                            if (typeof b.body !== "undefined") {

                                if (b.body.type == "ClassBody") {

                                    // Push the method here
                                    b.body.body.push(
                                        t.classMethod(
                                            "method",
                                            t.identifier(path.node.expression.left.property.name),
                                            path.node.expression.right.params,
                                            path.node.expression.right.body,
                                            false,
                                            true
                                        )
                                    );

                                }


                            }
                        });
                        //  path.remove();

                    } else {
                        const isObjectDefinationExpressionDeclaration = isLookaLike(path.node, {
                            type: "ExpressionStatement",
                            expression: {
                                type: "CallExpression",
                                callee: {
                                    type: "MemberExpression",
                                    object: {
                                        type: "Identifier",
                                        name: "Object"
                                    },
                                    property: {
                                        type: "Identifier",
                                        name: "defineProperty"
                                    }
                                },



                            }


                        });
                        if (!isObjectDefinationExpressionDeclaration) {
                            return;
                        }
                        if (path.node.expression.arguments[0].type == "MemberExpression") {
                            if (path.node.expression.arguments[0].object.name == globalClassName) {
                                if (path.node.expression.arguments[0].property.name == "prototype") {

                                    var methodName = path.node.expression.arguments[1].value;
                                    path.node.expression.arguments[2].properties.forEach((i, k) => {
                                        var kind = path.node.expression.arguments[2].properties[k].key.name;
                                        var key = t.identifier(methodName);
                                        var params = i.value.params;
                                        var body = i.value.body;
                                        path.parent.body.forEach(b => {

                                            if (typeof b.body !== "undefined") {

                                                if (b.body.type == "ClassBody") {

                                                    // Push the method here
                                                    b.body.body.push(
                                                        t.classMethod(
                                                            kind,
                                                            key,
                                                            params,
                                                            body
                                                        )
                                                    );
                                                }


                                            }
                                        });

                                    })
                                    //path.remove();
                                }
                            }
                        }
                    }




                }


                // CLEAN UP CODE HERE
                // ---> Add this to clean the code  ---->
                path.remove();

            },
            FunctionDeclaration(path) {
                path.remove();

            },
            AssignmentExpression(path) {
                const isProptypesExpressionDeclaration = isLookaLike(path.node, {
                    type: "AssignmentExpression",
                    left: {
                        type: "MemberExpression",
                        object: {
                            type: "MemberExpression",
                            object: {
                                type: "Identifier",
                                name: globalClassName
                            }
                        }
                    }

                });
                if (isProptypesExpressionDeclaration) {
                    path.remove()
                }
            }


        }
    };
}

function traverseThroughBodyAndReturnPrefixToBeAdded(path, t) {
    const isFunctionDeclaration = isLookaLike(path, {
        type: "FunctionDeclaration",
        id: {
            type: "Identifier"
        }
    });
    if (isFunctionDeclaration) {
        globalClassName = path.id.name;
        globalConstructor = path.body;
        globalConstructorParams = path.params;
        return t.classDeclaration({
                type: "Identifier",
                name: globalClassName
            },
            null,
            t.classBody([
                t.classMethod(
                    "constructor",
                    t.identifier("constructor"),
                    path.params,
                    path.body
                )
            ])

        );

    } else {
        const isProptypesExpressionDeclaration = isLookaLike(path, {
            type: "ExpressionStatement",
            expression: {
                type: "AssignmentExpression",
                left: {
                    type: "MemberExpression",
                    object: {
                        type: "MemberExpression",
                        object: {
                            type: "Identifier",
                            name: globalClassName
                        }
                    }
                }
            }
        });

        if (isProptypesExpressionDeclaration) {
            const isPrototypesMethodExpressionDeclaration = isLookaLike(path, {
                type: "ExpressionStatement",
                expression: {
                    type: "AssignmentExpression",
                    left: {
                        type: "MemberExpression",
                        object: {
                            type: "MemberExpression",
                            object: {
                                type: "Identifier",
                                name: globalClassName
                            },
                            property: {
                                type: "Identifier",
                                name: "prototype"
                            }
                        }
                    },
                    right: {
                        type: "FunctionExpression"
                    },


                }
            });

            if (isPrototypesMethodExpressionDeclaration) {
                // Do Nothing
            } else {
                globalConstructor.body.push(
                    t.assignmentExpression(
                        path.expression.operator,
                        t.memberExpression(
                            t.thisExpression(),
                            t.identifier(path.expression.left.property.name)
                        ),
                        path.expression.right
                    )
                );

            }


            return t.classDeclaration({
                    type: "Identifier",
                    name: globalClassName
                },
                null,
                t.classBody([
                    t.classMethod(
                        "constructor",
                        t.identifier("constructor"),
                        globalConstructorParams,
                        globalConstructor
                    )
                ])
            );
        }
        return false;
    }
}

function isLookaLike(a, b) {
    return (
        a &&
        b &&
        Object.keys(b).every(bKey => {
            const bVal = b[bKey];
            const aVal = a[bKey];
            if (typeof bVal === "function") {
                return bVal(aVal);
            }
            return isPrimitive(bVal) ? bVal === aVal : isLookaLike(aVal, bVal);
        })
    );
}

function isPrimitive(val) {
    return val == null || /^[sbn]/.test(typeof val);
}