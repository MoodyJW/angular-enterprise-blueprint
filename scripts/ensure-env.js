const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, '../src/environments');
const exampleFile = path.join(envDir, 'environment.example.ts');
const targetFile = path.join(envDir, 'environment.ts');
const prodFile = path.join(envDir, 'environment.prod.ts');

if (!fs.existsSync(exampleFile)) {
  console.error('CRITICAL: environment.example.ts not found. Cannot generate environment files.');
  process.exit(1);
}

function copyEnv(target) {
  if (!fs.existsSync(target)) {
    console.log(`Creating ${path.basename(target)} from example...`);
    fs.copyFileSync(exampleFile, target);
  } else {
    console.log(`${path.basename(target)} exists. Skipping.`);
  }
}

copyEnv(targetFile);
copyEnv(prodFile);
