const fs = require("fs");
const path = require("path");

const targetDir = __dirname; // points to current directory

function listFiles(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === "node_modules") continue;

    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(targetDir, fullPath);

    if (entry.isDirectory()) {
      console.log(`${prefix}📁 ${relativePath}`);
      listFiles(fullPath, prefix + "  ");
    } else {
      console.log(`${prefix}📄 ${relativePath}`);
    }
  }
}

console.log(`📂 Project Structure (inside /frontend):\n`);
listFiles(targetDir);
