// Validates badges/metadata/<type>.json: required fields, matching badge_type,
// no personal/health data fields, and an SVG for every badge.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dir = new URL("../badges/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const errors = [];
const files = readdirSync(join(dir, "metadata")).filter((f) => f.endsWith(".json"));
const forbidden = ["mood_score", "journal", "diagnosis", "email", "name_of_user", "wallet"];

if (files.length === 0) errors.push("no badge metadata found");

for (const file of files) {
    const type = Number(file.replace(".json", ""));
    const where = `metadata/${file}`;
    if (!Number.isInteger(type) || type < 1) {
        errors.push(`${where}: filename must be a positive integer badge_type`);
        continue;
    }
    let meta;
    try {
        meta = JSON.parse(readFileSync(join(dir, "metadata", file), "utf8"));
    } catch (e) {
        errors.push(`${where}: invalid JSON (${e.message})`);
        continue;
    }
    for (const key of ["name", "description", "image"]) {
        if (typeof meta[key] !== "string" || !meta[key].trim()) errors.push(`${where}: missing "${key}"`);
    }
    if (meta.image && !meta.image.endsWith(`/img/${type}.svg`)) errors.push(`${where}: image must point to img/${type}.svg`);
    const attrs = Array.isArray(meta.attributes) ? meta.attributes : [];
    const badgeType = attrs.find((a) => a.trait_type === "badge_type")?.value;
    if (badgeType !== type) errors.push(`${where}: attribute badge_type (${badgeType}) must equal ${type}`);
    if (attrs.find((a) => a.trait_type === "soulbound")?.value !== true) errors.push(`${where}: must declare soulbound: true`);
    for (const a of attrs) {
        if (forbidden.some((f) => String(a.trait_type).toLowerCase().includes(f))) {
            errors.push(`${where}: attribute "${a.trait_type}" looks like personal/health data. Never put that in public metadata`);
        }
    }
    if (!existsSync(join(dir, "img", `${type}.svg`))) errors.push(`img/${type}.svg missing`);
}

if (errors.length) {
    console.error(errors.map((e) => `✖ ${e}`).join("\n"));
    process.exit(1);
}
console.log(`✔ ${files.length} badge definitions valid`);
