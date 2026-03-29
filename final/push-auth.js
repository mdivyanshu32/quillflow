const { execSync } = require('child_process');

try {
  execSync('git add .', { stdio: 'inherit' });
  console.log(execSync('git commit -m "fix(auth): catch unhandled promise rejections blocking loading spinners"', { encoding: 'utf8' }));
  console.log(execSync('git push', { encoding: 'utf8' }));
  console.log("Success!");
} catch (e) {
  console.error("Error pushing:", e.message);
}
