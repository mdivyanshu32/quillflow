const { execSync } = require('child_process');
try {
  execSync('git add .', { stdio: 'inherit' });
  console.log(execSync('git commit -m "feat(audio): add pneumatic cyber fahhh sound on successful sign in"', { encoding: 'utf8' }));
  console.log(execSync('git push', { encoding: 'utf8' }));
  console.log("Successfully pushed audio UI.");
} catch (e) {
  console.error("Error pushing:", e?.message);
}
