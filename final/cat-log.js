const fs = require("fs");
const logs = fs.readFileSync("build-log.txt", "utf16le");
console.log(logs.slice(-3000));
