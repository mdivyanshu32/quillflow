const fs = require('fs');

let toml = fs.readFileSync('netlify.toml', 'utf8');

// Remove publish = ".next" which breaks the Next.js App Router plugin
toml = toml.replace(/publish\s*=\s*"\.next"\n/i, "");

// Remove dummy redirects
toml = toml.replace(/\[\[redirects\]\][\s\S]*?(?=\[|$)/g, "");

fs.writeFileSync('netlify.toml', toml);

const { execSync } = require('child_process');
console.log("Committing fix...");
try {
  execSync('git commit -am "fix(netlify): remove publish=.next and dummy redirects that cause a 404 on deployment" && git push');
  console.log("Pushed successfully.");
} catch (e) {
  console.log("Error pushing:", e.message);
  if (e.stdout) console.log(e.stdout.toString());
}
