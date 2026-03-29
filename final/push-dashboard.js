const { execSync } = require('child_process');
try {
  execSync('git add .', { stdio: 'inherit' });
  console.log(execSync('git commit -m "feat(ui): robotic cyber aesthetic overlay for authenticated dashboard"', { encoding: 'utf8' }));
  console.log(execSync('git push', { encoding: 'utf8' }));
  console.log("Successfully pushed dashboard cyber UI!");
} catch (e) {
  console.error("Error pushing:", e.message);
}
