const { execSync } = require('child_process');
try {
  console.log("Committing routing and UI overlays...");
  execSync('git add .', { stdio: 'inherit' });
  execSync('git commit -m "fix: force dark mode primitives and patch SSG Vercel 404 bugs via dynamic routing"', { stdio: 'inherit' });
  
  console.log("Pushing diagnostic patch to Vercel...");
  execSync('git push', { stdio: 'inherit' });
  console.log("SUCCESS!");
} catch (e) {}
