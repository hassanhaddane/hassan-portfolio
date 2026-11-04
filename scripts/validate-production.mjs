import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import ts from "typescript";

const root = process.cwd();
const failures = [];
const requiredFiles = [
  "app/fr/page.tsx",
  "app/en/page.tsx",
  "app/opengraph-image.tsx",
  "app/robots.ts",
  "app/sitemap.ts",
  "components/portfolio/about-v2.tsx",
  "components/portfolio/contact-v2.tsx",
  "components/portfolio/journey-expertise-v2.tsx",
  "components/ui/wordmark.tsx",
  "components/portfolio/projects-v2.tsx",
  "app/[locale]/work/[slug]/page.tsx",
  "public/sw.js",
  "public/cv-hassan-haddane.pdf",
  "public/projects/greecheck/home-desktop.png",
  "public/projects/greecheck/scan-desktop-crop.png",
  "public/projects/greecheck/product-desktop.png",
  "public/projects/greecheck/compare-desktop.png",
  "public/projects/808bloom/home-desktop.png",
  "public/projects/808bloom/home-mobile.png",
  "public/projects/ceo19/home-desktop.jpg",
  "public/projects/tech-express/v1-desktop.png",
  "public/projects/tech-express/v2-desktop.png",
];

async function exists(relativePath) {
  try {
    await stat(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

for (const file of requiredFiles) {
  if (!(await exists(file)))
    failures.push(`Missing required production file: ${file}`);
}

const cvPath = path.join(root, "public/cv-hassan-haddane.pdf");
if (await exists("public/cv-hassan-haddane.pdf")) {
  const cv = await readFile(cvPath);
  if (cv.subarray(0, 4).toString() !== "%PDF")
    failures.push("CV is not a valid PDF payload.");
  if (
    createHash("sha256").update(cv).digest("hex") !==
    "bba20e7d3fd52dcd072bad9f5ab79b7d973799b21bcebedaa8945ee5f17bfbfd"
  )
    failures.push("The approved source CV must remain unchanged.");
  if (cv.byteLength < 20_000) failures.push("CV PDF is unexpectedly small.");
}

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(absolute)));
    else if (/\.(?:ts|tsx|css|mjs)$/.test(entry.name)) files.push(absolute);
  }
  return files;
}

const sourceFiles = (
  await Promise.all(
    ["app", "components", "lib"].map((directory) =>
      collect(path.join(root, directory)),
    ),
  )
).flat();
const oldGithub = ["github.com", "lowkyz"].join("/");
const oldCanva = ["canva.com", "design"].join("/");
const forbidden = [
  oldGithub,
  oldCanva,
  "creativeLabCopy",
  "SignalLab",
  "TypeLab",
  "setMode(",
  "data-mode=",
  "#lab",
  "console.log(",
  "console.warn(",
  "console.error(",
];

for (const file of sourceFiles) {
  const source = await readFile(file, "utf8");
  for (const token of forbidden) {
    if (source.includes(token))
      failures.push(
        `${path.relative(root, file)} contains forbidden token: ${token}`,
      );
  }
  if (path.dirname(file) === path.join(root, "lib") && /\.ts$/.test(file)) {
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    const visit = (node) => {
      // Validate both object literals and the shared text(fr, en) data helper.
      if (ts.isObjectLiteralExpression(node)) {
        const props = node.properties.filter(ts.isPropertyAssignment);
        if (props.some((prop) => prop.name.getText(ast) === "fr")) {
          for (const locale of ["fr", "en"]) {
            const prop = props.find(
              (item) => item.name.getText(ast) === locale,
            );
            if (
              !prop ||
              (ts.isStringLiteral(prop.initializer) &&
                !prop.initializer.text.trim())
            )
              failures.push(
                `${path.relative(root, file)}: missing ${locale} translation`,
              );
          }
        }
      }
      if (
        ts.isCallExpression(node) &&
        node.expression.getText(ast) === "text"
      ) {
        if (
          node.arguments.length !== 2 ||
          node.arguments.some(
            (arg) => ts.isStringLiteral(arg) && !arg.text.trim(),
          )
        )
          failures.push(`${path.relative(root, file)}: empty bilingual text`);
      }
      ts.forEachChild(node, visit);
    };
    visit(ast);
  }
}

const globals = await readFile(path.join(root, "app/globals.css"), "utf8");
if (!globals.startsWith('@import "tailwindcss";'))
  failures.push("Tailwind CSS import must remain first in app/globals.css.");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.info(
  `Production validation passed: ${requiredFiles.length} artifacts and ${sourceFiles.length} source files checked.`,
);
