const { execSync } = require('child_process');

function run(cmd) {
  try {
    console.log(execSync(cmd, { encoding: 'utf8' }));
  } catch (e) {
    console.log(e.stdout ? e.stdout.toString() : e.message);
  }
}

// Rename specific files to enforce proper casing in git
const filesToFix = ["input", "button", "toaster", "badge", "datatable", "modal", "select", "spinner", "textarea"];

for (const f of filesToFix) {
  const Proper = f.charAt(0).toUpperCase() + f.slice(1);
  run(`git mv src/components/ui/${f}.tsx src/components/ui/${Proper}2.tsx`);
  run(`git mv src/components/ui/${Proper}2.tsx src/components/ui/${Proper}.tsx`);
}

// Add, commit and push
run('git add .');
run('git commit -m "build: fix linux case-sensitive component imports, ssg errors, and husky configs"');
run('git push');
