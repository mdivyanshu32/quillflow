const { execSync } = require('child_process');

try {
  console.log("Running build securely...");
  const out = execSync("npm run build", { 
    encoding: "utf8", 
    env: { ...process.env, CI: "true", NEXT_TELEMETRY_DISABLED: "1" }
  });
  console.log("Build succeeded!");
  console.log(out.slice(-2000));
} catch (e) {
  console.log("Build failed!");
  const out = e.stdout ? e.stdout.replace(/\r/g, '\n') : "";
  const err = e.stderr ? e.stderr.replace(/\r/g, '\n') : "";
  console.log("STDOUT:", out.slice(-4000));
  console.log("STDERR:", err.slice(-4000));
}
