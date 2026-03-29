const { execSync } = require('child_process');

try {
  execSync('git add src/app/page.tsx');
  console.log(execSync('git commit -m "feat(ui): implement premium saas landing page homepage"', { encoding: 'utf8' }));
  console.log(execSync('git push', { encoding: 'utf8' }));
  console.log("Landing page successfully pushed!");
} catch (e) {
  console.log("Error:", e.stdout ? e.stdout.toString() : e.message);
}
