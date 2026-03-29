const { execSync } = require('child_process');
try {
  execSync('git add src/app/globals.css', { stdio: 'inherit' });
  execSync('git commit -m "fix(ui): remove debug css wildcard border mapping"', { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
  console.log("Successfully pushed!");
} catch (e) {
  console.error("Failed:", e.message);
}
