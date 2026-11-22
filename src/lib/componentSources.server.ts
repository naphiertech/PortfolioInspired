import fs from "node:fs";
import path from "node:path";
import type {
  ComponentCatalogItem,
  LoadedComponentSourceFile,
} from "./componentsCatalog";

export function loadComponentSourceFiles(
  item: ComponentCatalogItem
): LoadedComponentSourceFile[] {
  const root = process.cwd();
  return item.sourceFiles.map((spec) => {
    const absPath = path.resolve(root, spec.path);
    try {
      const code = fs.readFileSync(absPath, "utf8").replace(/\r\n/g, "\n");
      const lineCount = code.split("\n").length;
      return {
        label: spec.label,
        language: spec.language,
        code,
        lineCount,
      };
    } catch {
      const fallback = `// Unable to read ${spec.path}`;
      return {
        label: spec.label,
        language: spec.language,
        code: fallback,
        lineCount: 1,
      };
    }
  });
}
