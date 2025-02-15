import { Project, Node } from "ts-morph";

// Initialize a project (you can use your tsconfig.json if needed)
const project = new Project();
const sourceFile = project.addSourceFileAtPath("./node_modules/@raycast/api/types/index.d.ts");

/**
 * Recursively print a node's kind and a short snippet of its text.
 * If the node is a module (or a class), it will iterate over its members.
 */
function printNode(node: Node, indent: string = "  ") {
  // Get a one-line snippet of the node (for clarity).
  const snippet = node.getText().split("\n")[0].trim();
  console.log(`${indent}${node.getKindName()}: ${snippet}`);

  // If the node is a module/namespace, walk through its block statements.
  if (Node.isModuleDeclaration(node)) {
    const body = node.getBody();
    if (body && Node.isModuleBlock(body)) {
      body.getStatements().forEach((stmt) => printNode(stmt, indent + "  "));
    }
  }

  // If the node is a class, you might want to inspect its members.
  if (Node.isClassDeclaration(node)) {
    node.getMembers().forEach((member) => printNode(member, indent + "  "));
  }
}

// Get all exported declarations from the source file.
const exportedDeclarations = sourceFile.getExportedDeclarations();

exportedDeclarations.forEach((declarations, exportName) => {
  console.log(`Export: ${exportName}`);
  declarations.forEach((declaration) => {
    // Log the top-level kind.
    console.log("  " + declaration.getKindName());
    // If the declaration is a module or namespace, print its inner members.
    if (Node.isModuleDeclaration(declaration)) {
      printNode(declaration, "    ");
    }
  });
});
