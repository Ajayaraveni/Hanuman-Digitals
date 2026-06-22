import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

function run(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${command} ${args.join(" ")}`));
      }
    });
    child.on("error", reject);
  });
}

async function main() {
  console.log("Running production build...");
  await run("npm", ["run", "build"]);

  console.log("Verifying build output...");
  const required = [
    path.join(dist, "index.html"),
    path.join(dist, "assets"),
  ];

  for (const file of required) {
    if (!fs.existsSync(file)) {
      throw new Error(`Missing required build artifact: ${path.relative(root, file)}`);
    }
    console.log(`  ✓ ${path.relative(root, file)}`);
  }

  const assets = fs.readdirSync(path.join(dist, "assets"));
  if (assets.length === 0) {
    throw new Error("dist/assets directory is empty");
  }
  console.log(`  ✓ dist/assets contains ${assets.length} file(s)`);

  console.log("Build verification passed.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
