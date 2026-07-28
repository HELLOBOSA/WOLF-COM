import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");

const migratedArticles = new Set([
  "golden-visa-greece-property-renovation-architect",
  "cost-building-house-spain-honest-guide-2026",
  "nie-nif-buy-property-spain-checklist-foreigners",
  "buying-rural-property-spain-land-classification-building-rights",
  "architect-interior-designer-project-manager-spain-difference",
  "spanish-horizontal-property-law-comunidad-foreign-owners",
  "find-manage-contractor-spain-no-spanish",
  "building-permits-madrid-licencia-obras-guide",
  "madrid-real-estate-investment-architecture-roi",
  "working-with-architect-spain-process-guide",
]);

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function redirectTargetFor(relativePath, currentTarget) {
  const segments = relativePath.split(path.sep);
  const slug = segments.at(-2);

  if (slug === "architects") return "/studio/architects/";
  if (slug === "well-ap-certification") return "/services/wellbeing/";
  if (migratedArticles.has(slug)) return `/journal/${slug}/`;

  return currentTarget;
}

let redirectFilesUpdated = 0;
let spanishRedirectsUpdated = 0;

for (const file of walk(root)) {
  if (path.basename(file) !== "index.html") continue;

  const relativePath = path.relative(root, file);
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes('http-equiv="refresh"')) continue;

  const targetMatch = html.match(/window\.location\.replace\('([^']+)'\)/);
  if (!targetMatch) continue;

  const currentTarget = targetMatch[1];
  const target = redirectTargetFor(relativePath, currentTarget);
  const shouldRetarget = target !== currentTarget;
  const isSpanishPath = relativePath.startsWith(`es${path.sep}`);
  const languageSetup = isSpanishPath
    ? "try{localStorage.setItem('wb-es-lang','es');}catch(e){}"
    : "";

  const canonical = `https://wolfblanc.com${target}`;
  let next = html;

  if (shouldRetarget) {
    next = next
      .replace(
        /<link rel="canonical" href="[^"]+">/,
        `<link rel="canonical" href="${canonical}">`,
      )
      .replace(
        /<meta http-equiv="refresh" content="[^"]+">/,
        `<meta http-equiv="refresh" content="0;url=${target}">`,
      )
      .replace(
        /<p>Redirecting to <a href="[^"]+">[^<]+<\/a><\/p>/,
        `<p>Redirecting to <a href="${target}">${target}</a></p>`,
      );
  }

  if (shouldRetarget || isSpanishPath) {
    next = next.replace(
      /<script>.*?window\.location\.replace\('[^']+'\);<\/script>/,
      `<script>${languageSetup}window.location.replace('${target}');</script>`,
    );
  }

  if (next !== html) {
    fs.writeFileSync(file, next);
    redirectFilesUpdated += 1;
    if (isSpanishPath) spanishRedirectsUpdated += 1;
  }
}

const redirectMapPath = path.join(root, "redirect-map.csv");
const redirectMap = fs.readFileSync(redirectMapPath, "utf8");
const updatedRedirectMap = redirectMap
  .split("\n")
  .map((line) => {
    if (!line || line.startsWith("old_path,")) return line;
    const fields = line.split(",");
    const oldPath = fields[0];
    const segments = oldPath.split("/").filter(Boolean);
    const slug = segments.at(-1);

    if (slug === "architects") {
      fields[1] = "/studio/architects/";
    } else if (slug === "well-ap-certification") {
      fields[1] = "/services/wellbeing/";
      if (segments.length === 1) fields[2] = "article-to-service";
    } else if (migratedArticles.has(slug)) {
      fields[1] = `/journal/${slug}/`;
      if (segments.length === 1) fields[2] = "article-in-repo";
    }

    return fields.join(",");
  })
  .join("\n");

if (updatedRedirectMap !== redirectMap) {
  fs.writeFileSync(redirectMapPath, updatedRedirectMap);
}

console.log(
  `Updated ${redirectFilesUpdated} redirect files, including ${spanishRedirectsUpdated} Spanish-language redirects.`,
);
