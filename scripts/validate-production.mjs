import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];
const requiredFiles = [
  "app/fr/page.tsx",
  "app/en/page.tsx",
  "app/opengraph-image.tsx",
  "app/robots.ts",
  "app/sitemap.ts",
  "components/portfolio/about.tsx",
  "components/portfolio/contact.tsx",
  "components/portfolio/knowledge-system.tsx",
  "public/sw.js",
  "public/cv-hassan-haddane.pdf",
  "public/projects/greecheck/home-desktop.png",
  "public/projects/greecheck/scan-desktop-crop.png",
  "public/projects/greecheck/product-desktop.png",
  "public/projects/greecheck/compare-desktop.png",
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
  if (!(await exists(file))) failures.push(`Missing required production file: ${file}`);
}

const cvPath = path.join(root, "public/cv-hassan-haddane.pdf");
if (await exists("public/cv-hassan-haddane.pdf")) {
  const cv = await readFile(cvPath);
  if (cv.subarray(0, 4).toString() !== "%PDF") failures.push("CV is not a valid PDF payload.");
  if (cv.byteLength < 20_000) failures.push("CV PDF is unexpectedly small.");
}

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(absolute));
    else if (/\.(?:ts|tsx|css|mjs)$/.test(entry.name)) files.push(absolute);
  }
  return files;
}

const sourceFiles = (
  await Promise.all(["app", "components", "lib"].map((directory) => collect(path.join(root, directory))))
).flat();
const oldGithub = ["github.com", "lowkyz"].join("/");
const oldCanva = ["canva.com", "design"].join("/");
const forbidden = [oldGithub, oldCanva, "console.log(", "console.warn(", "console.error("];

for (const file of sourceFiles) {
  const source = await readFile(file, "utf8");
  for (const token of forbidden) {
    if (source.includes(token)) failures.push(`${path.relative(root, file)} contains forbidden token: ${token}`);
  }
}

const globals = await readFile(path.join(root, "app/globals.css"), "utf8");
if (!globals.startsWith('@import "tailwindcss";')) failures.push("Tailwind CSS import must remain first in app/globals.css.");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.info(`Production validation passed: ${requiredFiles.length} artifacts and ${sourceFiles.length} source files checked.`);
