const { execSync } = require('child_process');

try {
  execSync('git add netlify.toml');
  console.log(execSync('git commit -m "fix(netlify): properly define toml config without wildcard overrides or .next publish dir"', { encoding: 'utf8' }));
  console.log(execSync('git push', { encoding: 'utf8' }));
  console.log("Successfully pushed!");
} catch (e) {
  console.log("Error:", e.stdout ? e.stdout.toString() : e.message);
}
