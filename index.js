export default function transformer(file, api) {
  const j = api.jscodeshift;

  const root = j(file.source);

  // Store class paths, used to push methods after class creation
  let classPaths = {};

  /*
    Transform to create Class
  */
  root
    // Find all function declarations in the document
    .find(j.FunctionDeclaration, {
      id: {
        type: "Identifier"
      }
    })
    .forEach(path => {
      const { id: pathId, params: pathParams, body: pathBody } = path.value;

      j(path).replaceWith(
        j.classDeclaration(
          pathId,
          j.classBody([
            j.methodDefinition(
              "method",
              j.identifier("constructor"),
              j.functionExpression(null, pathParams, pathBody)
            )
          ])
          // TODO: 3rd param => superClass support
        )
      );

      classPaths[pathId.name] = path;
    });

  /*
    Transform to create class methods based on prototype
  */
  root
    .find(j.AssignmentExpression, {
      left: {
        type: "MemberExpression",
        object: {
          property: {
            name: "prototype"
          }
        }
      },
      right: {
        type: "FunctionExpression"
      }
    })
    .forEach(path => {
      // Name of the class/function, For instance: ClassName.prototype.methodName
      const { name: className } = path.value.left.object.object;
      // Fetch previously stored path or insert methods
      const classPath = classPaths[className];
      const { body: classBody } = classPath.value.body;
      // Name of method
      const { property: methodName } = path.value.left;
      const { params: methodParams, body: methodBody } = path.value.right;
      classBody.push(
        j.methodDefinition(
          "method",
          methodName,
          j.functionExpression(null, methodParams, methodBody)
        )
      );
      j(path).remove();
    });

  /*
    Transform to create static class methods
  */
  root
    .find(j.AssignmentExpression, {
      left: {
        type: "MemberExpression",
        property: {
          type: "Identifier"
        }
      },
      right: {
        type: "FunctionExpression"
      }
    })
    .forEach(path => {
      // Name of the class/function, For instance: ClassName.prototype.methodName
      const { name: className } = path.value.left.object;
      // Fetch previously stored path or insert methods
      const classPath = classPaths[className];
      const { body: classBody } = classPath.value.body;
      // Name of method
      const { property: methodName } = path.value.left;
      const { params: methodParams, body: methodBody } = path.value.right;
      classBody.push(
        j.methodDefinition(
          "method",
          methodName,
          j.functionExpression(null, methodParams, methodBody),
          true
        )
      );
      j(path).remove();
    });

  /*
    Transform for getters, setters
  */
  root
    .find(j.CallExpression, {
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
      }
    })
    // .find(j.MemberExpression)
    .forEach(path => {
      // Name of the class/function, For instance: ClassName.prototype.methodName
      const { name: className } = path.value.arguments[0].object;
      // Fetch previously stored path or insert methods
      const classPath = classPaths[className];
      const { body: classBody } = classPath.value.body;
      // Name of method
      const { value: methodName } = path.value.arguments[1];

      const { properties } = path.value.arguments[2];

      properties.forEach(property => {
        // Type of method => get || set
        const { name: type } = property.key;
        const { params: methodParams, body: methodBody } = property.value;
        classBody.push(
          j.methodDefinition(
            type,
            j.identifier(methodName),
            j.functionExpression(null, methodParams, methodBody)
          )
        );
      });

      j(path).remove();
    });

  return root.toSource();
}
