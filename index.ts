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
function generateDashboardMarkdown(oldContent: string = ""): string {
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
    let status = STATUS_NOT_IMPL;
    const regex = new RegExp(`\\|\\s*${method}\\s*\\|\\s*(.*?)\\s*\\|`);
    const match = oldContent.match(regex);
    if (match && match[1].trim() !== STATUS_NOT_IMPL) {
      status = match[1].trim();
    }
    md += `| ${method.padEnd(27)} | ${status.padEnd(20)} |\n`;
  });

  // Generate module sections with tables
  for (const [moduleName, methods] of Object.entries(moduleMethods)) {
    md += `\n## ${moduleName}\n\n| Method | Status |\n|--------|--------|\n`;
    methods.forEach(method => {
      let status = STATUS_NOT_IMPL;
      const regex = new RegExp(`\\|\\s*${method}\\s*\\|\\s*(.*?)\\s*\\|`);
      const match = oldContent.match(regex);
      if (match && match[1].trim() !== STATUS_NOT_IMPL) {
        status = match[1].trim();
      }
      md += `| ${method} | ${status} |\n`;
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

const args = process.argv.slice(2);

function showHelp() {
  console.log("Usage: index.ts [options]");
  console.log("");
  console.log("Options:");
  console.log("  -w, --write   Regenerate dashboard markdown, overwriting dashboard.md file");
  console.log("  -h, --help    Show this help message");
}

if (args.includes("-h") || args.includes("--help")) {
  showHelp();
  process.exit(0);
}

const outputPath = path.join(__dirname, "dashboard.md");

if (args.includes("-w") || args.includes("--write")) {
  fs.writeFileSync(
    outputPath,
    generateDashboardMarkdown(fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : ""),
    "utf8"
  );
  console.log("Dashboard markdown generated at:", outputPath);
} else {
  console.log("Skipping markdown generation. Use -w or --write to regenerate dashboard.md file.");
}
