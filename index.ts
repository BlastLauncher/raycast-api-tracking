import * as fs from "fs";
import * as path from "path";

// Define status emojis and default status
const STATUS_DONE = "✅ Done";
const STATUS_WIP = "🚧 Work In Progress";
const STATUS_NOT_IMPL = "❌ Not Implemented";
const GITHUB_BASE_URL = "./";

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
    const status = getImplementationStatus(method);
    const decls = exportedDeclarations.get(method);
    let link = method;
    if (decls && decls.length > 0) {
      const { line } = sourceFile.getLineAndColumnAtPos(decls[0].getStart(false));
      link = `[${method}](${GITHUB_BASE_URL}api-index.d.ts#L${line})`;
    }
    md += `| ${link.padEnd(27)} | ${status.padEnd(20)} |\n`;
  });

  // Generate module sections with tables
  for (const [moduleName, methods] of Object.entries(moduleMethods)) {
    const declsModule = exportedDeclarations.get(moduleName);
    let moduleLink = moduleName;
    if (declsModule && declsModule.length > 0) {
      const { line } = sourceFile.getLineAndColumnAtPos(declsModule[0].getStart(false));
      moduleLink = `[${moduleName}](${GITHUB_BASE_URL}api-index.d.ts#L${line})`;
    }
    md += `\n## ${moduleLink}\n\n| Method | Status |\n|--------|--------|\n`;
    methods.forEach(method => {
      const status = getImplementationStatus(method, moduleName);
      const decls = exportedDeclarations.get(method);
      let methodLink = method;
      if (decls && decls.length > 0) {
        const { line } = sourceFile.getLineAndColumnAtPos(decls[0].getStart(false));
        methodLink = `[${method}](${GITHUB_BASE_URL}api-index.d.ts#L${line})`;
      }
      md += `| ${methodLink} | ${status} |\n`;
    });
  }

  // Helper function to recursively get nested type exports from a module declaration
  function getNestedTypes(moduleDecl: any, prefix: string = ""): { fullName: string, decl: Node }[] {
    let results: { fullName: string, decl: Node }[] = [];
    const body = moduleDecl.getBody();
    if (body && Node.isModuleBlock(body)) {
      body.getStatements().forEach(stmt => {
        if (Node.isModuleDeclaration(stmt)) {
          const newPrefix = prefix ? `${prefix}.${stmt.getName()}` : stmt.getName();
          results = results.concat(getNestedTypes(stmt, newPrefix));
        } else {
          const text = stmt.getText();
          const match = text.match(/export type ([A-Za-z0-9_]+)/);
          if (match) {
            const typeName = match[1];
            let fullName = prefix ? `${prefix}.${typeName}` : typeName;
            if (typeName === "Props") {
              results.push({ fullName, decl: stmt });
              if (stmt.getKindName() === "TypeAliasDeclaration") {
                try {
                  const typeAlias = stmt;
                  const propSymbols = typeAlias.getType().getProperties();
                  propSymbols.forEach(prop => {
                    const propName = prop.getName();
                    results.push({ fullName: fullName + "." + propName, decl: stmt });
                  });
                } catch (e) {
                  // Ignore errors if properties cannot be extracted
                }
              }
            } else {
              results.push({ fullName, decl: stmt });
            }
          }
        }
      });
    }
    return results;
  }

  // Generate Other Exports section as table format
  md += `\n## Other Exports\n\n`;
  otherExports.forEach(item => {
    const decls = exportedDeclarations.get(item);
    let nestedTypes: string[] = [];
    let hasNested = false;
    if (decls) {
      decls.forEach(decl => {
        if (Node.isModuleDeclaration(decl)) {
          const types = getNestedTypes(decl, item);
          if (types.length > 0) {
            nestedTypes = nestedTypes.concat(types);
            hasNested = true;
          }
        }
      });
    }
    let status = STATUS_NOT_IMPL;
    const regex = new RegExp(`\\|\\s*${item}\\s*\\|\\s*(.*?)\\s*\\|`);
    const match = oldContent.match(regex);
    if (match && match[1].trim() !== STATUS_NOT_IMPL) {
      status = match[1].trim();
    }
    if (hasNested) {
      const declsItem = exportedDeclarations.get(item);
      let itemLink = item;
      if (declsItem && declsItem.length > 0) {
        const { line } = sourceFile.getLineAndColumnAtPos(declsItem[0].getStart(false));
        itemLink = `[${item}](${GITHUB_BASE_URL}api-index.d.ts#L${line})`;
      }
      md += `### ${itemLink} - ${status}\n\n`;
      md += `| Property                         | Status               |\n`;
      md += `|----------------------------------|----------------------|\n`;
      nestedTypes.forEach(nested => {
        const propName = nested.fullName.replace(new RegExp('^' + item + '\\.'), "");
        const propStatus = getImplementationStatus(propName, item);
        let propLink = propName;
        const { line } = sourceFile.getLineAndColumnAtPos(nested.decl.getStart(false));
        if (line) {
          propLink = `[${propName}](${GITHUB_BASE_URL}api-index.d.ts#L${line})`;
        }
        md += `| ${propLink.padEnd(32)} | ${propStatus.padEnd(20)} |\n`;
      });
    } else {
      const declsItem = exportedDeclarations.get(item);
      let itemLink = item;
      if (declsItem && declsItem.length > 0) {
        const { line } = sourceFile.getLineAndColumnAtPos(declsItem[0].getStart(false));
        itemLink = `[${item}](${GITHUB_BASE_URL}api-index.d.ts#L${line})`;
      }
      md += `| ${itemLink.padEnd(30)} | ${status.padEnd(20)} |\n`;
    }
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
let repoPath = "../blast/packages/blast-api";
const repoArgIndex = args.findIndex(arg => arg === "-r" || arg === "--repo");
if (repoArgIndex !== -1 && args[repoArgIndex+1]) {
  repoPath = args[repoArgIndex+1];
}
if (!fs.existsSync(repoPath)) {
  console.error(`Repository path '${repoPath}' not found.`);
  process.exit(1);
}
function getDeepValue(obj: any, key: string): any {
  return key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

function getImplementationStatus(name: string, moduleName?: string): string {
  let blastApi: any;
  try {
    // Import all implementations from the index module in dist
    blastApi = require(path.join(repoPath, "dist", "index.js"));
  } catch (e) {
    return STATUS_NOT_IMPL;
  }
  let value;
  if (moduleName) {
    if (blastApi[moduleName] === undefined) {
      return STATUS_NOT_IMPL;
    }
    value = getDeepValue(blastApi[moduleName], name);
  } else {
    value = getDeepValue(blastApi, name);
  }
  return value !== undefined ? STATUS_DONE : STATUS_NOT_IMPL;
}

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
