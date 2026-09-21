import { readFileSync } from "node:fs";
import ts from "typescript";

export async function loadThemeConfig(configPath) {
  const source = readFileSync(configPath, "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: configPath,
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  if (errors.length) {
    throw new Error(
      errors
        .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))
        .join("\n"),
    );
  }

  const moduleUrl = `data:text/javascript;base64,${Buffer.from(result.outputText).toString("base64")}`;
  return import(moduleUrl);
}
