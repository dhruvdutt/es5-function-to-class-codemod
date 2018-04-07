export default function transformer(file, api) {
  const j = api.jscodeshift;

  const root = j(file.source);

  // Store class paths, used to push methods after class creation
  let classPaths = {};

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

  return root.toSource();
}
