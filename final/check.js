const fs = require('fs');
const { execSync } = require('child_process');

let tsOutput = '';
let lintOutput = '';

try {
  tsOutput = execSync('npx tsc --noEmit', { encoding: 'utf8' });
} catch (e) {
  tsOutput = e.stdout;
}

try {
  lintOutput = execSync('npx next lint', { encoding: 'utf8' });
} catch (e) {
  lintOutput = e.stdout;
}

const errors = {
  ts: tsOutput.split('\n').filter(Boolean),
  lint: lintOutput.split('\n').filter(Boolean)
};

fs.writeFileSync('errors.json', JSON.stringify(errors, null, 2));
