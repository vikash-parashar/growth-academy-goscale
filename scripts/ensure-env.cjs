/**
 * Copies example env files when missing so `npm run dev` works after clone.
 * Does not overwrite existing .env / .env.local.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function copyIfMissing(destRel, exampleRel) {
  const dest = path.join(root, destRel);
  const src = path.join(root, exampleRel);
  if (fs.existsSync(dest) || !fs.existsSync(src)) return;
  fs.copyFileSync(src, dest);
  console.log(`[ensure-env] Created ${destRel} from ${exampleRel} — review secrets before production.`);
}

copyIfMissing("frontend/.env.local", "frontend/.env.example");
copyIfMissing("backend/.env", "backend/.env.example");
