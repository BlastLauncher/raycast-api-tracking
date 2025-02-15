import * as fs from "fs";
import * as path from "path";

// Define status emojis and default status
const STATUS_DONE = "✅ Done";
const STATUS_WIP = "🚧 Work In Progress";
const STATUS_NOT_IMPL = "❌ Not Implemented";

// Import ts-morph types for dynamic extraction
import { Project, Node, SyntaxKind } from "ts-morph";

// Create a project and add the API declaration file
const project = new Project();
const sourceFile = project.addSourceFileAtPath("./node_modules/@raycast/api/types/index.d.ts");

// Extract exported declarations
const exportedDeclarations = sourceFile.getExportedDeclarations();

// Prepare dynamic lists
const globalFunctions: string[] = [];
const moduleMethods: Record<string, string[]> = {};
const otherExports: string[] = [];

// Iterate over exported declarations
exportedDeclarations.forEach((declarations, exportName) => {
  const hasFunction = declarations.some(decl => decl.getKindName() === "FunctionDeclaration");
  const hasModule = declarations.some(decl => Node.isModuleDeclaration(decl));
  if (hasFunction) {
    globalFunctions.push(exportName);
  } else if (hasModule) {
    const methods: string[] = [];
    declarations.forEach(decl => {
      if (Node.isModuleDeclaration(decl)) {
        const body = decl.getBody();
        if (body && Node.isModuleBlock(body)) {
          body.getStatements().forEach(stmt => {
            if (stmt.getKindName() === "FunctionDeclaration") {
              const ident = stmt.getFirstChildByKind(SyntaxKind.Identifier);
              if (ident) {
                methods.push(ident.getText());
              }
            }
          });
        }
      }
    });
    if (methods.length > 0) {
      moduleMethods[exportName] = methods;
    } else {
      otherExports.push(exportName);
    }
  } else {
    otherExports.push(exportName);
  }
});

// Function to generate the markdown content
function generateDashboardMarkdown(): string {
  let md = `# API Progress Dashboard

## Table of Contents

- [Global Functions](#global-functions)
- [AI](#ai)
- [BrowserExtension](#browserextension)
- [Clipboard](#clipboard)
- [LocalStorage](#localstorage)
- [WindowManagement](#windowmanagement)
- [Other Exports](#other-exports)

---

## Global Functions

| Method                      | Status               |
|-----------------------------|----------------------|\n`;

  globalFunctions.forEach(method => {
    md += `| ${method.padEnd(27)} | ${STATUS_NOT_IMPL.padEnd(20)} |\n`;
  });

  // Generate module sections with tables
  for (const [moduleName, methods] of Object.entries(moduleMethods)) {
    md += `\n## ${moduleName}\n\n| Method | Status |\n|--------|--------|\n`;
    methods.forEach(method => {
      md += `| ${method} | ${STATUS_NOT_IMPL} |\n`;
    });
  }

  // Generate Other Exports section
  md += `\n## Other Exports\n\n`;
  otherExports.forEach(item => {
    md += `- **${item}**\n`;
  });

  // Legend
  md += `

---

*Legend:*
- ${STATUS_DONE}
- ${STATUS_WIP}
- ${STATUS_NOT_IMPL}
`;
  return md;
}

// Write the generated markdown to dashboard.md
const outputPath = path.join(__dirname, "dashboard.md");
fs.writeFileSync(outputPath, generateDashboardMarkdown(), "utf8");
console.log("Dashboard markdown generated at:", outputPath);
