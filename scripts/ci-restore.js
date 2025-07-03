#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, '..', 'package.json');
const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Restore the bin field
package.bin = {
  "git-hook-messages": "dist/cli.js"
};

// Write back to package.json
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2) + '\n');

console.log('✅ Restored bin field to package.json');
console.log('Bin field:', JSON.stringify(package.bin, null, 2)); 