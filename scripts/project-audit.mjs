import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const relative = (file) => path.relative(root, file).replaceAll("\\", "/");
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(dir, entry.name))
        : [path.join(dir, entry.name)],
    );
const source = walk(path.join(root, "src"));
const code = source.filter((file) => /\.[jt]sx?$/.test(file));
const text = new Map(
  source
    .filter((file) => /\.(css|[jt]sx?)$/.test(file))
    .map((file) => [file, fs.readFileSync(file, "utf8")]),
);
const graph = new Map();
const errors = [];
const missingStyles = [];
const resolve = (file, specifier) => {
  if (!specifier.startsWith(".") && !specifier.startsWith("@/")) return null;
  const base = specifier.startsWith("@/")
    ? path.join(root, "src", specifier.slice(2))
    : path.resolve(path.dirname(file), specifier);
  return [
    base,
    ...[".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"].map(
      (extension) => base + extension,
    ),
  ].find(
    (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
  );
};
for (const file of code) {
  const ast = ts.createSourceFile(
    file,
    text.get(file),
    ts.ScriptTarget.Latest,
    true,
  );
  const dependencies = [];
  const css = new Map();
  const visit = (node) => {
    let specifier;
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    )
      specifier = node.moduleSpecifier.text;
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    )
      specifier = node.arguments[0].text;
    if (specifier) {
      const dependency = resolve(file, specifier);
      if (dependency) dependencies.push(dependency);
      else if (
        specifier.startsWith(".") ||
        specifier.startsWith("@/") ||
        specifier.endsWith(".css")
      )
        errors.push(`${relative(file)}: unresolved import ${specifier}`);
      if (
        dependency?.endsWith(".module.css") &&
        ts.isImportDeclaration(node) &&
        node.importClause?.name
      )
        css.set(
          node.importClause.name.text,
          new Set(
            [...text.get(dependency).matchAll(/\.([a-zA-Z_][\w-]*)/g)].map(
              (match) => match[1],
            ),
          ),
        );
    }
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      css.has(node.expression.text) &&
      !css.get(node.expression.text).has(node.name.text)
    )
      missingStyles.push({ file, name: node.name.text });
    ts.forEachChild(node, visit);
  };
  visit(ast);
  graph.set(file, dependencies);
}
const reachable = new Set();
const visit = (file) => {
  if (reachable.has(file)) return;
  reachable.add(file);
  for (const dependency of graph.get(file) || []) visit(dependency);
};
for (const file of code.filter((file) => relative(file).startsWith("src/app/")))
  visit(file);
const unused = code.filter((file) => !reachable.has(file));
for (const { file, name } of missingStyles)
  if (reachable.has(file))
    errors.push(`${relative(file)}: missing CSS class ${name}`);
const images = walk(path.join(root, "public"))
  .filter((file) => /\.(png|jpe?g|webp|svg|ico|avif|gif)$/.test(file))
  .map((file) => {
    const url =
      "/" +
      path.relative(path.join(root, "public"), file).replaceAll("\\", "/");
    const consumers = [...text]
      .filter(([, content]) => content.includes(url))
      .map(([consumer]) => relative(consumer));
    return {
      url,
      file: relative(file),
      consumers,
      active: consumers.some((consumer) =>
        reachable.has(path.join(root, consumer)),
      ),
    };
  });
for (const [file, content] of text)
  for (const match of content.matchAll(
    /["'`](\/(?:images|brand|product|industries|about)\/[^"'`\s${}]+\.(?:png|jpe?g|webp|svg|avif|gif))["'`]/g,
  )) {
    if (!fs.existsSync(path.join(root, "public", match[1])))
      errors.push(`${relative(file)}: missing image ${match[1]}`);
  }
const pageCss = source.filter(
  (file) =>
    relative(file).startsWith("src/components/pages/") && file.endsWith(".css"),
);
for (const file of pageCss) {
  const family = relative(file).split("/")[3];
  if (relative(file) !== `src/components/pages/${family}/${family}.module.css`)
    errors.push(`Unexpected section stylesheet: ${relative(file)}`);
}
if (process.argv.includes("--write")) {
  fs.writeFileSync(
    path.join(root, "docs/legacy-style-issues.json"),
    JSON.stringify(
      missingStyles
        .filter(({ file }) => !reachable.has(file))
        .map(({ file, name }) => ({
          file: relative(file),
          missingClass: name,
        })),
      null,
      2,
    ) + "\n",
  );
  fs.mkdirSync(path.join(root, "docs"), { recursive: true });
  fs.writeFileSync(
    path.join(root, "docs/unused-code.md"),
    `# Unused code inventory\n\nGenerated by \`pnpm audit:project:write\`. Files below are not reachable from any Next.js app entry through static imports, re-exports or literal dynamic imports. This is a file-level candidate list, not proof that every export is unused. Manual or computed loading needs review before deletion. Components are retained for now.\n\n## Components (${unused.filter((file) => file.endsWith(".tsx")).length})\n\n${unused
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => `- [${relative(file)}](../${relative(file)})`)
      .join("\n")}\n\n## Supporting code\n\n${unused
      .filter((file) => !file.endsWith(".tsx"))
      .map((file) => `- [${relative(file)}](../${relative(file)})`)
      .join("\n")}\n`,
  );
  fs.writeFileSync(
    path.join(root, "docs/image-inventory.md"),
    `# Image inventory\n\nGenerated by \`pnpm audit:project:write\`. Paths are relative to the website root. Shared assets have one canonical copy. “Inactive references” means only unreachable source files refer to the image. “No source references” requires manual review before deletion; public URLs can be consumed externally. App icons also live in \`src/app/icon.svg\` and \`src/app/favicon.ico\`.\n\n| Image | Status | Consuming section or content file |\n| --- | --- | --- |\n${images.map((image) => `| [${image.file}](../${image.file}) | ${image.active ? "Active" : image.consumers.length ? "Inactive references" : "No source references"} | ${image.consumers.map((file) => `[${file.replace("src/components/pages/", "").replace("src/lib/content/", "content/")}](../${file})`).join("<br>") || "—"} |`).join("\n")}\n`,
  );
}
console.log(
  `${pageCss.length} page stylesheets; ${images.length} images; ${unused.length} unreachable source files (${unused.filter((file) => file.endsWith(".tsx")).length} components).`,
);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    "Local imports, static CSS class references, page stylesheet layout and literal image paths pass.",
  );
