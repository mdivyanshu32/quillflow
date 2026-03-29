const { execSync } = require('child_process');

try {
  console.log("Checking TS...");
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  
  console.log("Adding files...");
  execSync('git add src/app/page.tsx tailwind.config.ts');
  
  console.log("Committing...");
  console.log(execSync('git commit -m "feat(ui): implement robotic cyber aesthetic landing page with floating 3d panel mockups"', { encoding: 'utf8' }));
  
  console.log("Pushing to GitHub...");
  console.log(execSync('git push', { encoding: 'utf8' }));
  
  console.log("Deployment dispatched successfully!");
} catch (e) {
  console.error("Error occurred:", e.message);
}
