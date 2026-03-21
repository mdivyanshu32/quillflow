const { execSync } = require('child_process');

try {
  const files = execSync('git ls-files src/components/ui/', { encoding: 'utf8' }).trim().split('\n');
  files.forEach(file => {
    // If file is all lowercase in git, but on file system we want PascalCase
    // We figure out the real filename on disk
    if (!file) return;
    const parts = file.split('/');
    const name = parts[parts.length - 1];
    
    // We know the intended names are PascalCase like 'Button.tsx', 'Input.tsx', etc.
    const realName = name.charAt(0).toUpperCase() + name.slice(1);
    
    if (name !== realName) {
      console.log(`Fixing casing for ${file} -> ${realName}`);
      
      const dir = 'src/components/ui/';
      
      // We must do a two-step git mv for Windows
      execSync(`git mv "${dir}${name}" "${dir}${name}.tmp"`);
      execSync(`git mv "${dir}${name}.tmp" "${dir}${realName}"`);
      
      console.log(`Renamed ${name} to ${realName} in git index.`);
    }
  });
  console.log("Done checking case!");
} catch (e) {
  console.log("Error:", e.message);
  if (e.stdout) console.log(e.stdout.toString());
  if (e.stderr) console.log(e.stderr.toString());
}
