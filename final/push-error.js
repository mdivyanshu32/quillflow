const { execSync } = require('child_process');
try {
  console.log("Committing error audio features...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "feat(audio): trigger custom error buzzer on failed auth attempts"', { stdio: 'inherit' });
  
  console.log("Deploying to Vercel...");
  execSync('git push', { stdio: 'inherit' });
  console.log("SUCCESS!");
} catch (e) {}
